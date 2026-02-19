import React, { useState } from 'react';
import { Home, User, Mail, Phone, MapPin, Lock, Building, CheckCircle, Star, Shield } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import type { PageType, RegisterFormData } from '../types/Index';
import { apiClient } from '../utils/Api';

export interface RegisterPageProps {
  setCurrentPage: (page: PageType) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    email: '',
    cpfCnpj: '',
    telefone: '',
    tipoLocalizacao: 'R',
    endereco: '',
    numeroEndereco: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    pais: 'BR',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.numeroEndereco.trim()) newErrors.numeroEndereco = 'Número é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.uf.trim()) newErrors.uf = 'UF é obrigatório';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirme a senha';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    const cpfCnpjClean = formData.cpfCnpj.replace(/\D/g, '');
    if (cpfCnpjClean && cpfCnpjClean.length !== 11 && cpfCnpjClean.length !== 14) {
      newErrors.cpfCnpj = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
    }

    if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não conferem';
    }

    if (formData.uf && formData.uf.length !== 2) {
      newErrors.uf = 'UF deve ter 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    setGeneralError('');

    if (!validateForm()) {
      setGeneralError('Por favor, corrija os erros no formulário');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmarSenha, ...dataToSend } = formData;

      const response = await apiClient('/cadastrar-anunciante', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao cadastrar');
      }

      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      setCurrentPage('login');
    } catch (error: any) {
      setGeneralError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const cepClean = formData.cep.replace(/\D/g, '');
    
    if (cepClean.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || prev.endereco,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            uf: data.uf || prev.uf
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Formulário de Cadastro */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Logo clicável */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition"
          >
            <Home className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-sky-600">Imov</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600 mb-6">
            Preencha seus dados para se tornar um anunciante
          </p>

          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{generalError}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Dados Pessoais */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-sky-500" />
                Dados Pessoais
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Input
                    label="Nome Completo *"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                  {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    icon={Mail}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      label="CPF/CNPJ *"
                      type="text"
                      value={formData.cpfCnpj}
                      onChange={(e) => handleChange('cpfCnpj', e.target.value.replace(/\D/g, ''))}
                      placeholder="000.000.000-00"
                    />
                    {errors.cpfCnpj && <p className="text-red-500 text-xs mt-1">{errors.cpfCnpj}</p>}
                  </div>

                  <div>
                    <Input
                      label="Telefone *"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      icon={Phone}
                    />
                    {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                Endereço
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      value={formData.tipoLocalizacao}
                      onChange={(e) => handleChange('tipoLocalizacao', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                    >
                      <option value="R">Residencial</option>
                      <option value="C">Comercial</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      label="CEP *"
                      type="text"
                      value={formData.cep}
                      onChange={(e) => handleChange('cep', e.target.value)}
                      placeholder="00000-000"                    
                    />
                    {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
                  </div>
                </div>

                <div>
                  <Input
                    label="Endereço *"
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    placeholder="Rua, Avenida, etc."
                  />
                  {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      label="Número *"
                      type="text"
                      value={formData.numeroEndereco}
                      onChange={(e) => handleChange('numeroEndereco', e.target.value)}
                      placeholder="123"
                    />
                    {errors.numeroEndereco && <p className="text-red-500 text-xs mt-1">{errors.numeroEndereco}</p>}
                  </div>

                  <div>
                    <Input
                      label="Complemento"
                      type="text"
                      value={formData.complemento}
                      onChange={(e) => handleChange('complemento', e.target.value)}
                      placeholder="Apto, Bloco"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Bairro *"
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => handleChange('bairro', e.target.value)}
                    placeholder="Nome do bairro"
                  />
                  {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Input
                      label="Cidade *"
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      placeholder="Nome da cidade"
                    />
                    {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>}
                  </div>

                  <div>
                    <Input
                      label="UF *"
                      type="text"
                      value={formData.uf}
                      onChange={(e) => handleChange('uf', e.target.value.toUpperCase())}
                      placeholder="SP"
                    />
                    {errors.uf && <p className="text-red-500 text-xs mt-1">{errors.uf}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Senha */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-500" />
                Segurança
              </h3>

              <div className="space-y-3">
                <div>
                  <Input
                    label="Senha *"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleChange('senha', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha}</p>}
                </div>

                <div>
                  <Input
                    label="Confirmar Senha *"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                    placeholder="Digite a senha novamente"
                  />
                  {errors.confirmarSenha && <p className="text-red-500 text-xs mt-1">{errors.confirmarSenha}</p>}
                </div>
              </div>
            </div>

            {/* Botão Submit */}
            <Button
              onClick={handleSubmit}
              variant="primary"
              fullWidth
              className="py-3 text-lg mt-6 cursor-pointer"
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding/Benefícios */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-sky-400 to-sky-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="mb-8">
            <Building className="w-16 h-16 mb-4" />
            <h2 className="text-4xl font-bold mb-4">
              Anuncie seus Imóveis
            </h2>
            <p className="text-xl text-sky-50">
              Cadastre-se e tenha acesso a milhares de potenciais compradores
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Gratuito para Começar</h3>
                <p className="text-sm text-sky-50">
                  Crie sua conta e comece a anunciar sem custos iniciais
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Destaque seus Anúncios</h3>
                <p className="text-sm text-sky-50">
                  Ferramentas para destacar seus imóveis e vender mais rápido
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Seguro e Confiável</h3>
                <p className="text-sm text-sky-50">
                  Seus dados protegidos com a melhor tecnologia de segurança
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Alcance Nacional</h3>
                <p className="text-sm text-sky-50">
                  Milhares de pessoas buscando imóveis em todo o Brasil
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-sky-50">
              "Cadastrei meu apartamento e vendi em menos de 2 semanas! Plataforma excelente!"
            </p>
            <p className="text-sm font-semibold mt-2">- Maria Silva, São Paulo</p>
          </div>
        </div>
      </div>
    </div>
  );
};