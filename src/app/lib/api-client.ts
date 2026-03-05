// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// API Helper
export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(``, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ` }),
        ...options.headers,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

export { API_URL, USE_MOCK };
