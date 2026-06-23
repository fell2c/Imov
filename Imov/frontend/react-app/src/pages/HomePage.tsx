import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import type { Property, PageType } from '../types/Index';
import { buscarAnuncios } from '../utils/anuncioService';

interface HomePageProps {
  setCurrentPage: (page: PageType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAnuncios = async (termo = ''): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const resultados = await buscarAnuncios(termo);
      setProperties(resultados);
    } catch (e) {
      console.error(e);
      setError('Não foi possível carregar os imóveis. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarAnuncios();
  }, []);

  const toggleFavorite = (id: number): void => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSearch = (): void => {
    carregarAnuncios(searchTerm);
  };

  const handleViewDetails = (id: number): void => {
    sessionStorage.setItem('detailAnuncioId', String(id));
    setCurrentPage('detail');
  };

  return (
    <>
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setCurrentPage={setCurrentPage}
      />

      <section className="bg-linear-to-r from-sky-400 to-sky-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-center font-bold mb-4">
            Encontre o imóvel dos seus sonhos
          </h1>
          <p className="text-xl mb-8 text-center text-sky-50">
            Busque por diferentes imóveis e encontre o que deseja.
          </p>

          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Imóveis em Destaque</h2>
          <button className="text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-po">
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mx-auto mb-4"></div>
            Carregando imóveis...
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => carregarAnuncios(searchTerm)}
              className="text-sky-600 hover:text-sky-700 font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Nenhum imóvel encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};