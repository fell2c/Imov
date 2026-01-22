import React from 'react';
import { Home } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-6 h-6 text-sky-400" />
              <span className="text-xl font-bold">Imov</span>
            </div>
            <p className="text-gray-400 text-sm">
              Sua plataforma completa para encontrar o imóvel perfeito.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Comprar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button className="hover:text-sky-400">Apartamentos</button></li>
              <li><button className="hover:text-sky-400">Casas</button></li>
              <li><button className="hover:text-sky-400">Terrenos</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Alugar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button className="hover:text-sky-400">Residencial</button></li>
              <li><button className="hover:text-sky-400">Comercial</button></li>
              <li><button className="hover:text-sky-400">Temporada</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>contato@imov.com.br</li>
              <li>(11) 9999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2026 Imov. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};