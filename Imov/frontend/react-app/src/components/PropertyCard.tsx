import React from 'react';
import { MapPin, Star, Bed, Bath, Square, Heart } from 'lucide-react';
import { Button } from './Button';
import type { PropertyCardProps } from '../types/Index';

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition group overflow-hidden">
      <div className="relative">
        <img
          src={property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
        <div className="absolute top-3 left-3 bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.type}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{property.title}</h3>
          {property.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{property.rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          {property.location}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms}
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            {property.area}m²
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-2xl font-bold text-sky-600">
              R$ {property.price.toLocaleString('pt-BR')}
            </p>
          </div>
          <Button variant="primary" className="text-sm" onClick={() => onViewDetails?.(property.id)}>
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
};