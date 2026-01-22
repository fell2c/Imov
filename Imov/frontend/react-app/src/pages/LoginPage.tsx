import React, { useState } from 'react';
import { Home, Search, Heart, MapPin } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import type { PageProps } from '../types/Index';

export const LoginPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = (): void => {
    console.log('Login:', { email, password, rememberMe });
    // Aqui você pode adicionar a lógica de autenticação
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => setCurrentPage('home')}
            className="mb-8 text-sky-600 hover:text-sky-700 flex items-center gap-2 transition"
          >
            ← Voltar
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Home className="w-10 h-10 text-sky-500" />
            <span className="text-3xl font-bold text-sky-600">Imov</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600 mb-8">
            Entre com suas credenciais para acessar sua conta
          </p>

          {/* Login Form */}
          <div className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-sky-500 border-gray-300 rounded focus:ring-sky-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 select-none">
                  Lembrar-me
                </span>
              </div>
              <button className="text-sm text-sky-600 hover:text-sky-700 transition">
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              variant="primary"
              fullWidth
              className="py-3 text-lg"
            >
              Entrar
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <button className="text-sky-600 hover:text-sky-700 font-semibold transition">
                Cadastre-se gratuitamente
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="py-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button variant="outline" className="py-3">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding/Information */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sky-400 to-sky-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h2 className="text-4xl font-bold mb-6">
            Encontre seu próximo lar com facilidade
          </h2>
          <p className="text-xl text-sky-50 mb-8">
            Acesse milhares de imóveis, salve seus favoritos e encontre o lugar perfeito para você.
          </p>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Busca Inteligente</h3>
                <p className="text-sm text-sky-50">
                  Encontre exatamente o que procura
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Favoritos</h3>
                <p className="text-sm text-sky-50">
                  Salve e compare seus imóveis preferidos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Localização</h3>
                <p className="text-sm text-sky-50">
                  Explore por bairro e região
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};