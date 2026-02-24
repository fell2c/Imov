import React, { useState } from 'react';
import { Home, Mail, ArrowLeft, CheckCircle, Lock, Shield, HelpCircle, Key } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import type { PageType } from '../types/Index';
import { apiClient } from '../utils/Api';

interface ForgotPasswordPageProps {
  setCurrentPage: (page: PageType) => void;
}

type Step = 'email' | 'code' | 'password' | 'success';

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ setCurrentPage }) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Passo 1: Enviar email com código
  const handleSendCode = async (): Promise<void> => {
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
      const response = await apiClient('/enviar-codigo-recuperacao', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao enviar código');
      }

      // Código enviado com sucesso
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Passo 2: Validar código
  const handleValidateCode = async (): Promise<void> => {
    setError('');

    if (!code.trim()) {
      setError('Por favor, insira o código');
      return;
    }

    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient('/auth/validate-code', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Código inválido');
      }

      // Código válido
      setStep('password');
    } catch (err: any) {
      setError(err.message || 'Código inválido ou expirado');
    } finally {
      setIsLoading(false);
    }
  };

  // Passo 3: Redefinir senha
  const handleResetPassword = async (): Promise<void> => {
    setError('');

    if (!newPassword) {
      setError('Digite a nova senha');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao redefinir senha');
      }

      // Senha redefinida com sucesso
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo clicável */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 mb-8 hover:opacity-80 transition"
          >
            <Home className="w-10 h-10 text-sky-500" />
            <span className="text-3xl font-bold text-sky-600">Imov</span>
          </button>

          {/* Passo 1: Digitar Email */}
          {step === 'email' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Esqueceu sua senha?
              </h1>
              <p className="text-gray-600 mb-8">
                Digite seu email e enviaremos um código de verificação.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6" onKeyPress={(e) => handleKeyPress(e, handleSendCode)}>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  icon={Mail}
                />

                <Button 
                  onClick={handleSendCode} 
                  variant="primary" 
                  fullWidth 
                  className="py-3 text-lg"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Código'}
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
            </>
          )}

          {/* Passo 2: Validar Código */}
          {step === 'code' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Verifique seu Email
              </h1>
              <p className="text-gray-600 mb-8">
                Enviamos um código de 6 dígitos para <strong>{email}</strong>
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6" onKeyPress={(e) => handleKeyPress(e, handleValidateCode)}>
                <Input
                  label="Código de Verificação"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  icon={Key}
                />

                <Button 
                  onClick={handleValidateCode} 
                  variant="primary" 
                  fullWidth 
                  className="py-3 text-lg"
                >
                  {isLoading ? 'Validando...' : 'Validar Código'}
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setStep('email')}
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>

                <button
                  onClick={handleSendCode}
                  className="text-sm text-gray-600 hover:text-sky-600 transition"
                >
                  Não recebeu o código? <span className="font-semibold">Reenviar</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      Dica
                    </h3>
                    <p className="text-xs text-gray-600">
                      Verifique sua caixa de spam caso não encontre o email.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Passo 3: Nova Senha */}
          {step === 'password' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Criar Nova Senha
              </h1>
              <p className="text-gray-600 mb-8">
                Digite sua nova senha para {email}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6" onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}>
                <Input
                  label="Nova Senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  icon={Lock}
                />

                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  icon={Lock}
                />

                <Button 
                  onClick={handleResetPassword} 
                  variant="primary" 
                  fullWidth 
                  className="py-3 text-lg"
                >
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                </Button>
              </div>

              <div className="mt-8 p-4 bg-sky-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Sua senha deve conter:
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}>●</span>
                    Pelo menos 6 caracteres
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={newPassword === confirmPassword && newPassword ? 'text-green-600' : 'text-gray-400'}>●</span>
                    As senhas devem ser iguais
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Passo 4: Sucesso */}
          {step === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Senha Redefinida!
              </h1>
              <p className="text-gray-600 mb-8">
                Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
              </p>

              <Button
                onClick={() => setCurrentPage('login')}
                variant="primary"
                fullWidth
                className="py-3 text-lg"
              >
                Ir para o Login
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-linear-to-br from-sky-400 to-sky-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <Lock className="w-16 h-16 mb-6" />
          
          <h2 className="text-4xl font-bold mb-6">
            Recuperação Segura
          </h2>
          <p className="text-xl text-sky-50 mb-8">
            Processo em 3 passos para garantir sua segurança
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`${step === 'email' || step === 'code' || step === 'password' || step === 'success' ? 'bg-white text-sky-600' : 'bg-white/20 text-white'} p-3 rounded-lg backdrop-blur-sm shrink-0 font-bold`}>
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Informar Email</h3>
                <p className="text-sm text-sky-50">
                  Digite o email cadastrado na sua conta
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`${step === 'code' || step === 'password' || step === 'success' ? 'bg-white text-sky-600' : 'bg-white/20 text-white'} p-3 rounded-lg backdrop-blur-sm flex-shrink-0 font-bold`}>
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Validar Código</h3>
                <p className="text-sm text-sky-50">
                  Insira o código de 6 dígitos enviado por email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`${step === 'password' || step === 'success' ? 'bg-white text-sky-600' : 'bg-white/20 text-white'} p-3 rounded-lg backdrop-blur-sm shrink-0 font-bold`}>
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Nova Senha</h3>
                <p className="text-sm text-sky-50">
                  Defina uma nova senha segura para sua conta
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Segurança Garantida</h3>
                <p className="text-sm text-sky-50">
                  Códigos válidos por apenas 15 minutos e podem ser usados uma única vez
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};