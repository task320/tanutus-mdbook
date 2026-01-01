import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Mock user data
const MOCK_USER: User = {
  id: 'mock-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: () => {
    // Simulate login delay
    setTimeout(() => {
      set({ user: MOCK_USER, isAuthenticated: true });
    }, 500);
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
