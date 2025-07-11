import axios from 'axios';
import { User, Round, LoginRequest, TapResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Перехватчик для обработки 401 ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Если получили 401, очищаем состояние аутентификации
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginRequest) => {
    console.log('Attempting login with:', credentials);
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  me: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const roundApi = {
  getRounds: async (): Promise<{ rounds: Round[] }> => {
    const response = await api.get('/rounds');
    return response.data;
  },
  
  getRound: async (id: string): Promise<{ round: Round }> => {
    const response = await api.get(`/rounds/${id}`);
    return response.data;
  },
  
  createRound: async (): Promise<{ roundId: string }> => {
    const response = await api.post('/rounds', {});
    return response.data;
  },
};

export const gameApi = {
  tap: async (roundId: string): Promise<TapResponse> => {
    const response = await api.post('/tap', { roundId });
    return response.data;
  },
};
