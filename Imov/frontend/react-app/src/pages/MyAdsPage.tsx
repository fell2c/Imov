import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { PageType } from '../types/Index.ts';
import { Plus, Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Building2 } from 'lucide-react';
import { Button } from '../components/Button';

interface MyAdsPageProps {
  setCurrentPage: (page: PageType) => void;
}

// Interface para os anúncios (exemplo)
interface Ad {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  status: 'active' | 'inactive' | 'pending';
  views: number;
}

export const MyAdsPage: React.FC<MyAdsPageProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Mock de dados - substitua por chamada à API
  const [ads] = useState<Ad[]>([
    {
      id: 1,
      title: 'Apartamento Moderno no Centro',
      price: 450000,
      location: 'Centro, São Paulo',
      bedrooms: 3,
      bathrooms: 2,
      area: 85,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      status: 'active',
      views: 245
    },
    {
      id: 2,
      title: 'Casa com Piscina',
      price: 890000,
      location: 'Jardins, São Paulo',
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      status: 'active',
      views: 189
    },
    {
      id: 3,
      title: 'Studio Compacto',
      price: 280000,
      location: 'Vila Mariana, São Paulo',
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      status: 'pending',
      views: 67
    }
  ]);

  const handleDeleteAd = (id: number): void => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      // Aqui você faria a chamada à API para deletar
      console.log('Deletar anúncio:', id);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <>
      <Header 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Meus Anúncios
            </h1>
            <p className="text-gray-600">
              Gerencie seus imóveis anunciados
            </p>
          </div>
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
            Novo Anúncio
          </Button>
        </div>

        {/* Estatísticas */}
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
                <p className="text-3xl font-bold text-green-600">
                  {ads.filter(ad => ad.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Visualizações</p>
                <p className="text-3xl font-bold text-sky-600">
                  {ads.reduce((sum, ad) => sum + ad.views, 0)}
                </p>
              </div>
              <div className="bg-sky-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-sky-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Anúncios */}
        {ads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum anúncio ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece anunciando seu primeiro imóvel
            </p>
            <Button variant="primary" icon={Plus}>
              Criar Primeiro Anúncio
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Imagem */}
                  <div className="md:w-64 h-48 md:h-auto">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {ad.title}
                          </h3>
                          {getStatusBadge(ad.status)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          {ad.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-600">
                          R$ {ad.price.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {ad.bedrooms} quartos
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {ad.bathrooms} banheiros
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        {ad.area}m²
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {ad.views} visualizações
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3">
                      <Button variant="primary" className="flex-1">
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </Button>
                      <Button variant="secondary" className="flex-1">
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