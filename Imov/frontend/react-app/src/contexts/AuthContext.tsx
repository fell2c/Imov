import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType, LoginResponse } from "../types/Index.ts";
import { apiClient } from "../utils/Api.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      // Sem token armazenado, não há sessão para verificar
      if (!localStorage.getItem("accessToken")) {
        setUser(null);
        return;
      }

      const response = await apiClient("/me");

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        console.log("✅ Usuário autenticado:", userData);
      } else {
        setUser(null);
        console.log("❌ Usuário NÃO autenticado");
      }
    } catch (error) {
      console.log("❌ Erro ao verificar autenticação:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (login: string, senha: string): Promise<void> => {
    try {
      const response = await apiClient("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Credenciais inválidas");
      }

      const data: LoginResponse = await response.json();

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.anunciante);
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
      localStorage.removeItem("accessToken");
      setUser(null);
      window.location.href = "/";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isLoginModalOpen: false,
    login,
    logout,
    showLogin: () => {},
    hideLogin: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
