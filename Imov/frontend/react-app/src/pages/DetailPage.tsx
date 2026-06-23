import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Bed, Bath, Square, Car, Tag, Phone, Mail, User } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { Anuncio, PageType } from '../types/Index';
import { getAnuncioById } from '../utils/anuncioService';

interface DetailPageProps {
  setCurrentPage: (page: PageType) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop';

const TIPO_IMOVEL: Record<string, string> = { C: 'Casa', A: 'Apartamento', L: 'Lote' };
const TIPO_NEGOCIO: Record<string, string> = { V: 'Venda', A: 'Aluguel', T: 'Troca' };

export const DetailPage: React.FC<DetailPageProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('detailAnuncioId');
    if (!id) {
      setError('Imóvel não encontrado.');
      setIsLoading(false);
      return;
    }
    getAnuncioById(Number(id))
      .then(setAnuncio)
      .catch(() => setError('Não foi possível carregar o imóvel.'))
      .finally(() => setIsLoading(false));
  }, []);

  const im = anuncio?.imovel;
  const dono = anuncio?.anunciante;

  return (
    <>
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mx-auto mb-4"></div>
            Carregando imóvel...
          </div>
        ) : error || !anuncio || !im ? (
          <div className="text-center py-20 text-red-600">{error ?? 'Imóvel não encontrado.'}</div>
        ) : (
          <div className="space-y-6">
            <img
              src={FALLBACK_IMAGE}
              alt={anuncio.descricao}
              className="w-full h-72 sm:h-96 object-cover rounded-xl shadow"
            />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {TIPO_IMOVEL[im.tipoImovel] ?? 'Imóvel'}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {TIPO_NEGOCIO[im.tipoNegocio] ?? '-'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">{anuncio.descricao}</h1>
                <div className="flex items-center gap-1 text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  {[im.endereco, im.bairro, `${im.cidade}/${im.uf}`].filter(Boolean).join(', ')}
                </div>
              </div>
              <p className="text-3xl font-bold text-sky-600 whitespace-nowrap">
                R$ {im.valor.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
                <Bed className="w-6 h-6 text-sky-600" />
                <div><p className="text-lg font-bold text-gray-800">{im.quarto ?? 0}</p><p className="text-xs text-gray-500">Quartos</p></div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
                <Bath className="w-6 h-6 text-sky-600" />
                <div><p className="text-lg font-bold text-gray-800">{im.banheiro ?? 0}</p><p className="text-xs text-gray-500">Banheiros</p></div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
                <Car className="w-6 h-6 text-sky-600" />
                <div><p className="text-lg font-bold text-gray-800">{im.garagem ?? 0}</p><p className="text-xs text-gray-500">Garagens</p></div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
                <Square className="w-6 h-6 text-sky-600" />
                <div><p className="text-lg font-bold text-gray-800">{im.areaTotal ?? 0}m²</p><p className="text-xs text-gray-500">Área total</p></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Sobre o imóvel</h2>
              <p className="text-gray-600">{im.descricao}</p>
            </div>

            {dono && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Anunciante</h2>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2"><User className="w-4 h-4 text-sky-600" /> {dono.nome}</p>
                  {dono.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-600" /> {dono.email}</p>}
                  {dono.telefone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-sky-600" /> {dono.telefone}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
