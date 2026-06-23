import { apiClient, API_URL } from './Api';
import type { Anuncio, Imovel, Property, TipoAnuncio } from '../types/Index';

/** Monta a URL pública de uma imagem a partir do nome do arquivo. */
export const imagemUrl = (nomeArquivo: string): string => `${API_URL}/imagens/${nomeArquivo}`;

export interface NovoAnuncioPayload {
  id?: number;
  descricao: string;
  dataInicio: string;
  ativo: boolean;
  anunciante: { id: number };
  tipoAnuncio: { id: number };
  imovel: {
    id?: number;
    descricao: string;
    tipoImovel: string;
    tipoNegocio: string;
    valor: number;
    tipoLocalizacao: string;
    endereco: string;
    numeroEndereco?: string;
    complemento?: string;
    cep?: string;
    bairro?: string;
    cidade: string;
    uf: string;
    pais: string;
    quarto?: number;
    banheiro?: number;
    garagem?: number;
    suite?: number;
    areaTotal?: number;
  };
}

// Imagem padrão enquanto o backend não armazena fotos dos imóveis
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';

const TIPO_IMOVEL_LABEL: Record<string, string> = {
  C: 'Casa',
  A: 'Apartamento',
  L: 'Lote',
};

/** Converte o Anuncio (estrutura do backend) para o Property usado na UI. */
export const anuncioToProperty = (anuncio: Anuncio): Property => {
  const imovel: Imovel = anuncio.imovel;
  const primeiraImagem = imovel.imagens && imovel.imagens.length > 0
    ? imagemUrl(imovel.imagens[0].nomeArquivo)
    : FALLBACK_IMAGE;
  return {
    id: anuncio.id,
    title: anuncio.descricao || imovel.descricao,
    price: imovel.valor,
    location: `${imovel.cidade}, ${imovel.uf}`,
    bedrooms: imovel.quarto ?? 0,
    bathrooms: imovel.banheiro ?? 0,
    area: imovel.areaTotal ?? imovel.areaConstruida ?? imovel.areaPrivativa ?? 0,
    image: primeiraImagem,
    type: TIPO_IMOVEL_LABEL[imovel.tipoImovel] ?? 'Imóvel',
  };
};

/** Lista todos os anúncios. */
export const getAnuncios = async (): Promise<Property[]> => {
  const response = await apiClient('/buscar-anuncios');
  if (!response.ok) {
    throw new Error('Falha ao buscar anúncios');
  }
  const anuncios: Anuncio[] = await response.json();
  return anuncios.map(anuncioToProperty);
};

/** Atualiza um anúncio existente (requer autenticação e ser o dono). */
export const alterarAnuncio = async (payload: NovoAnuncioPayload): Promise<void> => {
  const response = await apiClient('/alterar-anuncio', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Falha ao alterar anúncio');
  }
};

/** Exclui um anúncio (requer autenticação e ser o dono). */
export const excluirAnuncio = async (id: number): Promise<void> => {
  const response = await apiClient(`/excluir-anuncio/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Falha ao excluir anúncio');
  }
};

/** Lista os anúncios (estrutura completa) de um anunciante específico. */
export const getAnunciosByAnunciante = async (idAnunciante: number): Promise<Anuncio[]> => {
  const response = await apiClient(`/buscar-anuncios/filtros?idAnunciante=${idAnunciante}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar anúncios do anunciante');
  }
  return response.json();
};

/** Busca um único anúncio (estrutura completa) por id. */
export const getAnuncioById = async (id: number): Promise<Anuncio> => {
  const response = await apiClient(`/buscar-anuncio/${id}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar o anúncio');
  }
  return response.json();
};

/** Lista os tipos de anúncio disponíveis (Bronze/Prata/Ouro). */
export const getTiposAnuncio = async (): Promise<TipoAnuncio[]> => {
  const response = await apiClient('/buscar-tipos-anuncio');
  if (!response.ok) {
    throw new Error('Falha ao buscar tipos de anúncio');
  }
  return response.json();
};

/** Cria um novo anúncio (requer autenticação). Retorna os ids gerados. */
export const criarAnuncio = async (
  payload: NovoAnuncioPayload
): Promise<{ id: number; imovelId: number }> => {
  const response = await apiClient('/cadastrar-anuncio', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Falha ao cadastrar anúncio');
  }
  return response.json();
};

/** Envia imagens de um imóvel (multipart, requer autenticação). */
export const uploadImagens = async (idImovel: number, files: File[]): Promise<void> => {
  if (files.length === 0) return;
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));

  // Multipart: NÃO definir Content-Type (o browser define o boundary)
  const response = await fetch(`${API_URL}/imovel/${idImovel}/imagens`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Falha ao enviar imagens');
  }
};

/** Busca anúncios por um termo livre (aplicado à descrição). */
export const buscarAnuncios = async (termo: string): Promise<Property[]> => {
  const query = termo.trim()
    ? `?ativo=true&descricao=${encodeURIComponent(termo.trim())}`
    : '?ativo=true';
  const response = await apiClient(`/buscar-anuncios/filtros${query}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar anúncios');
  }
  const anuncios: Anuncio[] = await response.json();
  return anuncios.map(anuncioToProperty);
};
