import React, { useState } from 'react';
import { Building2, Home, Star, DollarSign, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { PropertyCard } from '../components/PropertyCard';
import type { Property, Category, PageType } from '../types/Index';

interface HomePageProps {
  setCurrentPage: (page: PageType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const properties: Property[] = [
    {
      id: 1,
      title: 'Apartamento Moderno no Centro',
      price: 450000,
      location: 'Centro, São Paulo',
      bedrooms: 3,
      bathrooms: 2,
      area: 85,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      rating: 4.8,
      type: 'Apartamento'
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
      rating: 4.9,
      type: 'Casa'
    },
    {
      id: 3,
      title: 'Cobertura Duplex Premium',
      price: 1200000,
      location: 'Moema, São Paulo',
      bedrooms: 4,
      bathrooms: 4,
      area: 180,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      rating: 5.0,
      type: 'Cobertura'
    },
    {
      id: 4,
      title: 'Studio Compacto',
      price: 280000,
      location: 'Vila Mariana, São Paulo',
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      rating: 4.5,
      type: 'Studio'
    },
    {
      id: 5,
      title: 'Loft Contemporâneo',
      price: 620000,
      location: 'Pinheiros, São Paulo',
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
      rating: 4.7,
      type: 'Loft'
    },
    {
      id: 6,
      title: 'Casa de Condomínio',
      price: 750000,
      location: 'Morumbi, São Paulo',
      bedrooms: 3,
      bathrooms: 3,
      area: 200,
      image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=400&h=300&fit=crop',
      rating: 4.6,
      type: 'Casa'
    }
  ];

  const categories: Category[] = [
    { name: 'Apartamentos', icon: Building2, count: 234 },
    { name: 'Casas', icon: Home, count: 156 },
    { name: 'Lançamentos', icon: Star, count: 45 },
    { name: 'Alto Padrão', icon: DollarSign, count: 78 }
  ];

  const toggleFavorite = (id: number): void => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSearch = (): void => {
    console.log('Searching for:', searchTerm);
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encontre o Imóvel dos Seus Sonhos
          </h1>
          <p className="text-xl mb-8 text-sky-50">
            Milhares de opções para você comprar ou alugar
          </p>

          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categorias Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Imóveis em Destaque</h2>
          <button className="text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};