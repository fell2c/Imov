const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'include', // CRUCIAL: Envia cookies HttpOnly
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  // Se retornar 401 (não autorizado), redireciona
  if (response.status === 401) {
    window.location.href = '/';
  }

  return response;
};
