export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  rating: number;
  type: string;
}

export interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string; 
}

export interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export interface CategoryCardProps {
  category: Category;
}

export interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCurrentPage: (page: PageType) => void;
}

export interface PageProps {
  setCurrentPage: (page: 'home' | 'login') => void;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  cpfCnpj: string;
  telefone?: string;
  tipoLocalizacao: string;
  endereco?: string;
  numeroEndereco?: string;
  complemento?: string;
  cep?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  pais?: string;
  saldo: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  showLogin: () => void;
  hideLogin: () => void;
}

export interface LoginResponse {
  accessToken: string;
  anunciante: User;
}

export type PageType = 'home' | 'login' | 'my-ads' | 'profile';