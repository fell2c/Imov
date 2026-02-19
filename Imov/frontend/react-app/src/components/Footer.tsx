import React from 'react';
import { Home } from 'lucide-react';
import { FaFacebook, FaInstagram } from "react-icons/fa";

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
              A plataforma completa para encontrar seu imóvel perfeito.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-center">Sociais</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-center items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-400 transition"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-400 transition"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
              </div>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-center mb-4">Alugar</h3>
            <ul className="space-y-2 text-sm text-center text-gray-400">
              <li><button className="hover:text-sky-400">Residencial</button></li>
              <li><button className="hover:text-sky-400">Comercial</button></li>
              <li><button className="hover:text-sky-400">Temporada</button></li> 
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-center mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-center text-gray-400">
              <li>contato@imov.com.br</li>
              <li>(11) 9999-9999</li>
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