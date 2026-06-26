import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        // Store token in localStorage for API interceptor
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      
      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface ToastState {
  message: string;
  type: 'success' | 'error' | null;
  show: boolean;
  showToast: (message: string, type: 'success' | 'error') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: null,
  show: false,
  
  showToast: (message, type) => {
    set({ message, type, show: true });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set({ show: false });
    }, 5000);
  },
  
  hideToast: () => set({ show: false }),
}));

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      
      setTheme: (theme) => {
        set({ theme });
        
        if (typeof window !== 'undefined') {
          const root = document.documentElement;
          
          if (theme === 'system') {
            // Remove manual theme class, let CSS media query handle it
            root.classList.remove('light', 'dark');
          } else {
            // Remove both classes first
            root.classList.remove('light', 'dark');
            // Add the selected theme
            root.classList.add(theme);
          }
        }
      },
      
      initTheme: () => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('theme-storage');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              const theme = parsed.state?.theme || 'system';
              
              const root = document.documentElement;
              if (theme === 'system') {
                root.classList.remove('light', 'dark');
              } else {
                root.classList.remove('light', 'dark');
                root.classList.add(theme);
              }
            } catch (e) {
              console.error('Failed to parse theme', e);
            }
          }
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
