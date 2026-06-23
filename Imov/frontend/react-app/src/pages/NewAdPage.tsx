import React, { useEffect, useState } from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import type { Anuncio, PageType, TipoAnuncio } from '../types/Index';
import { useAuth } from '../contexts/AuthContext';
import { alterarAnuncio, criarAnuncio, getTiposAnuncio } from '../utils/anuncioService';

interface NewAdPageProps {
  setCurrentPage: (page: PageType) => void;
}

const CATEGORIA_LABEL: Record<string, string> = {
  B: 'Bronze',
  P: 'Prata',
  O: 'Ouro',
};

export const NewAdPage: React.FC<NewAdPageProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [tipos, setTipos] = useState<TipoAnuncio[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Edicao: anuncio recebido via sessionStorage (setado em "Meus Anuncios")
  const [editId, setEditId] = useState<number | null>(null);
  const [imovelId, setImovelId] = useState<number | null>(null);

  const hoje = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    // Anuncio
    descricao: '',
    dataInicio: hoje,
    tipoAnuncioId: '',
    // Imovel
    imovelDescricao: '',
    tipoImovel: 'C',
    tipoNegocio: 'V',
    valor: '',
    tipoLocalizacao: 'U',
    endereco: '',
    numeroEndereco: '',
    bairro: '',
    cep: '',
    cidade: '',
    uf: '',
    pais: 'BR',
    quarto: '',
    banheiro: '',
    garagem: '',
    areaTotal: '',
  });

  const setField = (campo: keyof typeof form, valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }));

  useEffect(() => {
    // Carrega anuncio para edicao, se houver
    const bruto = sessionStorage.getItem('editAnuncio');
    let anuncioEdit: Anuncio | null = null;
    if (bruto) {
      try {
        anuncioEdit = JSON.parse(bruto) as Anuncio;
      } catch {
        anuncioEdit = null;
      }
      sessionStorage.removeItem('editAnuncio');
    }

    if (anuncioEdit) {
      const im = anuncioEdit.imovel;
      setEditId(anuncioEdit.id);
      setImovelId(im.id);
      setForm({
        descricao: anuncioEdit.descricao ?? '',
        dataInicio: anuncioEdit.dataInicio ?? hoje,
        tipoAnuncioId: anuncioEdit.tipoAnuncio ? String(anuncioEdit.tipoAnuncio.id) : '',
        imovelDescricao: im.descricao ?? '',
        tipoImovel: im.tipoImovel ?? 'C',
        tipoNegocio: im.tipoNegocio ?? 'V',
        valor: im.valor != null ? String(im.valor) : '',
        tipoLocalizacao: im.tipoLocalizacao ?? 'U',
        endereco: im.endereco ?? '',
        numeroEndereco: im.numeroEndereco ?? '',
        bairro: im.bairro ?? '',
        cep: im.cep ?? '',
        cidade: im.cidade ?? '',
        uf: im.uf ?? '',
        pais: im.pais ?? 'BR',
        quarto: im.quarto != null ? String(im.quarto) : '',
        banheiro: im.banheiro != null ? String(im.banheiro) : '',
        garagem: im.garagem != null ? String(im.garagem) : '',
        areaTotal: im.areaTotal != null ? String(im.areaTotal) : '',
      });
    }

    getTiposAnuncio()
      .then(lista => {
        setTipos(lista);
        // So define o tipo padrao quando for um anuncio novo
        if (!anuncioEdit && lista.length > 0) setField('tipoAnuncioId', String(lista[0].id));
      })
      .catch(() => setError('Não foi possível carregar os tipos de anúncio.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (): Promise<void> => {
    setError('');

    if (!user) {
      setError('Você precisa estar logado para criar um anúncio.');
      return;
    }
    if (!form.descricao.trim() || !form.imovelDescricao.trim() || !form.valor ||
        !form.endereco.trim() || !form.cidade.trim() || !form.uf.trim() || !form.tipoAnuncioId) {
      setError('Preencha os campos obrigatórios (*).');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...(editId != null ? { id: editId } : {}),
        descricao: form.descricao.trim(),
        dataInicio: form.dataInicio,
        ativo: true,
        anunciante: { id: user.id },
        tipoAnuncio: { id: Number(form.tipoAnuncioId) },
        imovel: {
          ...(imovelId != null ? { id: imovelId } : {}),
          descricao: form.imovelDescricao.trim(),
          tipoImovel: form.tipoImovel,
          tipoNegocio: form.tipoNegocio,
          valor: Number(form.valor),
          tipoLocalizacao: form.tipoLocalizacao,
          endereco: form.endereco.trim(),
          numeroEndereco: form.numeroEndereco || undefined,
          bairro: form.bairro || undefined,
          cep: form.cep || undefined,
          cidade: form.cidade.trim(),
          uf: form.uf.trim().toUpperCase(),
          pais: form.pais.trim().toUpperCase() || 'BR',
          quarto: form.quarto ? Number(form.quarto) : undefined,
          banheiro: form.banheiro ? Number(form.banheiro) : undefined,
          garagem: form.garagem ? Number(form.garagem) : undefined,
          areaTotal: form.areaTotal ? Number(form.areaTotal) : undefined,
        },
      };

      if (editId != null) {
        await alterarAnuncio(payload);
        alert('Anúncio atualizado com sucesso!');
      } else {
        await criarAnuncio(payload);
        alert('Anúncio criado com sucesso!');
      }
      setCurrentPage('my-ads');
    } catch {
      setError('Erro ao criar o anúncio. Verifique os dados e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition';

  return (
    <>
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => setCurrentPage('my-ads')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Meus Anúncios
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-sky-100 p-3 rounded-lg">
            <Building2 className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{editId != null ? 'Editar Anúncio' : 'Novo Anúncio'}</h1>
            <p className="text-gray-600">{editId != null ? 'Atualize os dados do seu anúncio' : 'Cadastre um imóvel para anunciar'}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-8">
          {/* Dados do anúncio */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Dados do Anúncio</h3>
            <Input
              label="Título do anúncio *"
              value={form.descricao}
              onChange={(e) => setField('descricao', e.target.value)}
              placeholder="Ex.: Apartamento moderno no centro"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plano *</label>
                <select
                  value={form.tipoAnuncioId}
                  onChange={(e) => setField('tipoAnuncioId', e.target.value)}
                  className={selectClass}
                >
                  {tipos.map(t => (
                    <option key={t.id} value={t.id}>
                      {CATEGORIA_LABEL[t.categoria] ?? t.categoria} — R$ {t.valor} / {t.duracaoDia} dias
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Data de início *"
                type="date"
                value={form.dataInicio}
                onChange={(e) => setField('dataInicio', e.target.value)}
              />
            </div>
          </section>

          {/* Dados do imóvel */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Dados do Imóvel</h3>
            <Input
              label="Descrição do imóvel *"
              value={form.imovelDescricao}
              onChange={(e) => setField('imovelDescricao', e.target.value)}
              placeholder="Ex.: Apto 2 quartos, 75m²"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select value={form.tipoImovel} onChange={(e) => setField('tipoImovel', e.target.value)} className={selectClass}>
                  <option value="C">Casa</option>
                  <option value="A">Apartamento</option>
                  <option value="L">Lote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Negócio *</label>
                <select value={form.tipoNegocio} onChange={(e) => setField('tipoNegocio', e.target.value)} className={selectClass}>
                  <option value="V">Venda</option>
                  <option value="A">Aluguel</option>
                  <option value="T">Troca</option>
                </select>
              </div>
              <Input
                label="Valor (R$) *"
                type="number"
                value={form.valor}
                onChange={(e) => setField('valor', e.target.value)}
                placeholder="350000"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização *</label>
                <select value={form.tipoLocalizacao} onChange={(e) => setField('tipoLocalizacao', e.target.value)} className={selectClass}>
                  <option value="U">Urbana</option>
                  <option value="R">Rural</option>
                </select>
              </div>
              <Input label="CEP" value={form.cep} onChange={(e) => setField('cep', e.target.value)} placeholder="00000-000" />
              <Input label="Bairro" value={form.bairro} onChange={(e) => setField('bairro', e.target.value)} placeholder="Centro" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Endereço *" className="sm:col-span-2" value={form.endereco} onChange={(e) => setField('endereco', e.target.value)} placeholder="Rua, Avenida..." />
              <Input label="Número" value={form.numeroEndereco} onChange={(e) => setField('numeroEndereco', e.target.value)} placeholder="123" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Cidade *" className="sm:col-span-2" value={form.cidade} onChange={(e) => setField('cidade', e.target.value)} placeholder="São Paulo" />
              <Input label="UF *" value={form.uf} onChange={(e) => setField('uf', e.target.value.toUpperCase())} placeholder="SP" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input label="Quartos" type="number" value={form.quarto} onChange={(e) => setField('quarto', e.target.value)} placeholder="2" />
              <Input label="Banheiros" type="number" value={form.banheiro} onChange={(e) => setField('banheiro', e.target.value)} placeholder="1" />
              <Input label="Garagens" type="number" value={form.garagem} onChange={(e) => setField('garagem', e.target.value)} placeholder="1" />
              <Input label="Área total (m²)" type="number" value={form.areaTotal} onChange={(e) => setField('areaTotal', e.target.value)} placeholder="75" />
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setCurrentPage('my-ads')} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} className="flex-1">
              {isSaving ? 'Salvando...' : editId != null ? 'Salvar Alterações' : 'Criar Anúncio'}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
