export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image?: string;
  rating?: number;
  type: string;
}

// ----- DTOs vindos do backend -----

export interface Imovel {
  id: number;
  descricao: string;
  tipoImovel: string;   // C = Casa, A = Apartamento, L = Lote
  tipoNegocio: string;  // A = Aluguel, V = Venda, T = Troca
  valor: number;
  tipoLocalizacao?: string; // U = Urbana, R = Rural
  endereco?: string;
  numeroEndereco?: string;
  complemento?: string;
  cep?: string;
  cidade: string;
  uf: string;
  pais?: string;
  bairro?: string;
  quarto?: number;
  banheiro?: number;
  garagem?: number;
  suite?: number;
  areaTotal?: number;
  areaConstruida?: number;
  areaPrivativa?: number;
}

export interface Anuncio {
  id: number;
  descricao: string;
  ativo: boolean;
  dataInicio?: string;
  imovel: Imovel;
  tipoAnuncio?: TipoAnuncio;
  anunciante?: User;
}

export interface TipoAnuncio {
  id: number;
  categoria: string; // B = Bronze, P = Prata, O = Ouro
  valor: number;
  duracaoDia: number;
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

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
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
  onViewDetails?: (id: number) => void;
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

export interface RegisterFormData {
  nome: string;
  email: string;
  cpfCnpj: string;
  telefone: string;
  tipoLocalizacao: string;
  endereco: string;
  numeroEndereco: string;
  complemento: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  senha: string;
  confirmarSenha: string;
}

export type PageType = 'home' | 'login' | 'register' | 'forgot-password' | 'my-ads' | 'profile' | 'new-ad' | 'detail';