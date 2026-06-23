const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_URL}${endpoint}`;

  // Anexa o token JWT (se houver) no header Authorization de toda requisição
  const token = localStorage.getItem('accessToken');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Se retornar 401 (não autorizado), limpa o token e redireciona
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  }

  return response;
};
