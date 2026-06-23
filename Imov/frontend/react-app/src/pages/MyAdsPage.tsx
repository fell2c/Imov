import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { Anuncio, PageType } from '../types/Index.ts';
import { Plus, Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Building2 } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { excluirAnuncio, getAnunciosByAnunciante } from '../utils/anuncioService';

interface MyAdsPageProps {
  setCurrentPage: (page: PageType) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';

export const MyAdsPage: React.FC<MyAdsPageProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [ads, setAds] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = async (): Promise<void> => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      setAds(await getAnunciosByAnunciante(user.id));
    } catch (e) {
      console.error(e);
      setError('Não foi possível carregar seus anúncios.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEditAd = (anuncio: Anuncio): void => {
    sessionStorage.setItem('editAnuncio', JSON.stringify(anuncio));
    setCurrentPage('new-ad');
  };

  const handleDeleteAd = async (id: number): Promise<void> => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;
    try {
      await excluirAnuncio(id);
      setAds(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
      alert('Não foi possível excluir o anúncio.');
    }
  };

  const getStatusBadge = (ativo: boolean) => {
    const badge = ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    const label = ativo ? 'Ativo' : 'Inativo';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge}`}>
        {label}
      </span>
    );
  };

  const ativos = ads.filter(a => a.ativo).length;

  return (
    <>
      <Header 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Meus Anúncios
            </h1>
            <p className="text-gray-600">
              Gerencie seus imóveis anunciados
            </p>
          </div>
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto" onClick={() => setCurrentPage('new-ad')}>
            Novo Anúncio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Anúncios</p>
                <p className="text-3xl font-bold text-gray-800">{ads.length}</p>
              </div>
              <div className="bg-sky-100 p-3 rounded-lg">
                <Building2 className="w-8 h-8 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Anúncios Ativos</p>
                <p className="text-3xl font-bold text-green-600">{ativos}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Anúncios Inativos</p>
                <p className="text-3xl font-bold text-gray-500">{ads.length - ativos}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Building2 className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mx-auto mb-4"></div>
            Carregando seus anúncios...
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={carregar} className="text-sky-600 hover:text-sky-700 font-semibold">
              Tentar novamente
            </button>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum anúncio ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece anunciando seu primeiro imóvel
            </p>
            <Button variant="primary" icon={Plus} onClick={() => setCurrentPage('new-ad')}>
              Criar Primeiro Anúncio
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto">
                    <img
                      src={FALLBACK_IMAGE}
                      alt={ad.descricao}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {ad.descricao}
                          </h3>
                          {getStatusBadge(ad.ativo)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          {ad.imovel.cidade}, {ad.imovel.uf}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-600">
                          R$ {ad.imovel.valor.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {ad.imovel.quarto ?? 0} quartos
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {ad.imovel.banheiro ?? 0} banheiros
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        {ad.imovel.areaTotal ?? 0}m²
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="secondary" className="flex-1" onClick={() => handleEditAd(ad)}>
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteAd(ad.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};