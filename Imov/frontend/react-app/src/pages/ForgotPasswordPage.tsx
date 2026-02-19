import React, { useState } from 'react';
import { Home, Mail, ArrowLeft, CheckCircle, Lock, Shield, HelpCircle } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import type { PageType } from '../types/Index';
import { apiClient } from '../utils/Api';

interface ForgotPasswordPageProps {
  setCurrentPage: (page: PageType) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    setError('');

    if (!email.trim()) {
      setError('Por favor, insira seu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao enviar email');
      }

      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !emailSent) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 mb-8 hover:opacity-80 transition"
          >
            <Home className="w-10 h-10 text-sky-500" />
            <span className="text-3xl font-bold text-sky-600">Imov</span>
          </button>

          {!emailSent ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Esqueceu sua senha?
              </h1>
              <p className="text-gray-600 mb-8">
                Não se preocupe! Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6" onKeyPress={handleKeyPress}>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  icon={Mail}
                />

                <Button 
                  onClick={handleSubmit} 
                  variant="primary" 
                  fullWidth 
                  className="py-3 text-lg"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </button>
              </div>

              <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      Dica de Segurança
                    </h3>
                    <p className="text-xs text-gray-600">
                      Verifique sua caixa de spam caso não receba o email em alguns minutos.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Email Enviado!
                </h1>
                <p className="text-gray-600 mb-8">
                  Enviamos um link de recuperação para <strong>{email}</strong>
                </p>

                <div className="bg-sky-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">Próximos passos:</h3>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-sky-600">1.</span>
                      <span>Verifique sua caixa de entrada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-sky-600">2.</span>
                      <span>Clique no link recebido (válido por 1 hora)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-sky-600">3.</span>
                      <span>Crie sua nova senha</span>
                    </li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setCurrentPage('login')}
                    variant="primary"
                    fullWidth
                    className="py-3"
                  >
                    Voltar para o Login
                  </Button>

                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                      setError('');
                    }}
                    className="w-full text-sm text-sky-600 hover:text-sky-700 transition"
                  >
                    Não recebeu o email? Enviar novamente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sky-400 to-sky-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <Lock className="w-16 h-16 mb-6" />
          
          <h2 className="text-4xl font-bold mb-6">
            Recuperação Segura
          </h2>
          <p className="text-xl text-sky-50 mb-8">
            Protegemos seus dados com os mais altos padrões de segurança
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Processo Seguro</h3>
                <p className="text-sm text-sky-50">
                  Link único e temporário enviado apenas para seu email cadastrado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Verificação por Email</h3>
                <p className="text-sm text-sky-50">
                  Garantimos que apenas você possa acessar sua conta
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Criptografia Avançada</h3>
                <p className="text-sm text-sky-50">
                  Suas senhas são armazenadas com criptografia de ponta
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <h3 className="font-semibold text-lg mb-2">Precisa de ajuda?</h3>
            <p className="text-sm text-sky-50 mb-3">
              Nossa equipe está disponível para auxiliar você
            </p>
            <p className="text-sm">
              📧 suporte@imov.com.br<br />
              📱 (11) 9999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};