import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { PageType } from '../types/Index.ts';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Mail, Phone, MapPin as Location, Edit2, Save, X as CloseIcon, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { apiClient } from '../utils/Api.ts';

interface ProfilePageProps {
  setCurrentPage: (page: PageType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: user?.nome || '',
    email: user?.email || '',
    phone: user?.telefone || '',
    location: [user?.cidade, user?.uf].filter(Boolean).join(', ')
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async (): Promise<void> => {
    console.log('Salvando perfil:', formData);
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setFormData({
      name: user?.nome || '',
      email: user?.email || '',
      phone: user?.telefone || '',
      location: [user?.cidade, user?.uf].filter(Boolean).join(', ')
    });
    setIsEditing(false);
  };

  const handleSavePassword = async (): Promise<void> => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas novas não coincidem!');
      return;
    }

    if (!user?.id) {
      alert('Erro: Usuário não identificado. Faça login novamente.');
      return;
    }

    setIsLoadingPassword(true);

    try {
      const payload = {
        id: user.id,
        senhaVelha: passwordData.currentPassword,
        senhaNova: passwordData.newPassword
      };

      const response = await apiClient('/alterar-senha-logado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',        
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = await response.text();
          alert(errorMessage || 'A senha antiga está incorreta!');
          return;
        } else if (response.status === 404) {
          alert('Usuário não encontrado!');
          return;
        } else {
          throw new Error('Erro ao alterar senha');
        }
      }
      const data = await response.json();
      console.log('Senha alterada com sucesso:', data);

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
      alert('Senha alterada com sucesso!');

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha. Tente novamente mais tarde.');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleCancelPassword = (): void => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  return (
    <>
      <Header 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Meu Perfil
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-linear-to-r from-sky-400 to-sky-600 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-sky-500" />
                </div>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{user?.nome}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              {!isEditing && (
                <Button 
                  variant="outline" 
                  icon={Edit2}
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Informações Pessoais
                </h3>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Nome Completo"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      icon={UserIcon}
                    />

                    <Input
                      label="E-mail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      icon={Mail}
                    />

                    <Input
                      label="Telefone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      icon={Phone}
                    />

                    <Input
                      label="Localização"
                      type="text"
                      value={formData.location ?? ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      icon={Location}
                    />

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="primary" 
                        icon={Save}
                        onClick={handleSave}
                        className="flex-1"
                      >
                        Salvar Alterações
                      </Button>
                      <Button 
                        variant="outline" 
                        icon={CloseIcon}
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Nome Completo</p>
                        <p className="font-medium text-gray-800">{formData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">E-mail</p>
                        <p className="font-medium text-gray-800">{formData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="font-medium text-gray-800">{formData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Location className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Localização</p>
                        <p className="font-medium text-gray-800">{formData.location}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Segurança
                  </h3>

                  {!isChangingPassword ? (
                    <Button 
                      variant="outline"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      Alterar Senha
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        label="Senha Atual"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        icon={Lock}
                        placeholder="Digite sua senha atual"
                      />

                      <Input
                        label="Nova Senha"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        icon={Lock}
                        placeholder="Digite sua nova senha"
                      />

                      <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        icon={Lock}
                        placeholder="Confirme sua nova senha"
                      />

                      <div className="flex gap-3 pt-2">
                        <Button 
                          variant="primary" 
                          icon={Save}
                          onClick={handleSavePassword}
                          className="flex-1"                        
                        >
                          {isLoadingPassword ? 'Salvando...' : 'Salvar Nova Senha'}
                        </Button>
                        <Button 
                          variant="outline" 
                          icon={CloseIcon}
                          onClick={handleCancelPassword}
                          className="flex-1"                      
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};