import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { PageType } from '../types/Index.ts';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Mail, Phone, MapPin as Location, Edit2, Save, X as CloseIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface ProfilePageProps {
  setCurrentPage: (page: PageType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Estados para edição
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-9999',
    location: 'São Paulo, SP'
  });

  const handleSave = async (): Promise<void> => {
    // Aqui você faria a chamada à API para atualizar o perfil
    console.log('Salvando perfil:', formData);
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '(11) 99999-9999',
      location: 'São Paulo, SP'
    });
    setIsEditing(false);
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
          {/* Header do Perfil */}
          <div className="bg-linear-to-r from-sky-400 to-sky-600 h-32"></div>
          
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-sky-500" />
                </div>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
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

            {/* Informações do Perfil */}
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
                      value={formData.location}
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

              {/* Seção de Segurança */}
              {!isEditing && (
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Segurança
                  </h3>
                  <Button variant="outline">
                    Alterar Senha
                  </Button>
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