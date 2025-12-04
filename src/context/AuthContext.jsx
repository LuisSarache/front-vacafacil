import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar usuário do storage
  const loadUserFromStorage = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token_backup');
    const userData = localStorage.getItem('user');

    console.log('Token:', token ? 'existe' : 'não existe');
    console.log('UserData:', userData);

    if (token && userData && userData !== 'undefined') {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Usuário carregado do storage:', parsedUser);
        
        // Garantir que name existe
        const mappedUser = {
          ...parsedUser,
          name: parsedUser.nome || parsedUser.name || 'Usuário'
        };
        
        setUser(mappedUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        localStorage.removeItem('token_backup');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    setLoading(false);
  }, []);

  // Listener para mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      loadUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await apiService.login(email, password);
      
      // Buscar dados do usuário
      const userData = await apiService.request('/auth/me');
      
      console.log('Dados do usuário da API:', userData);
      
      // Mapear campos do backend (português) para frontend (inglês)
      const mappedUser = {
        id: userData.id,
        email: userData.email,
        name: userData.nome || userData.name || 'Usuário',
        phone: userData.telefone || userData.phone || '',
        farmName: userData.fazenda || userData.farmName || '',
        type: userData.tipo || userData.type || 'produtor'
      };
      
      console.log('Dados mapeados:', mappedUser);
      
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      
      ToastManager.success(`Bem-vindo, ${mappedUser.name}!`);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      ToastManager.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await apiService.register(userData);
      ToastManager.success('Cadastro realizado com sucesso!');
      return { success: true };
    } catch (error) {
      ToastManager.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      apiService.logout();
      localStorage.removeItem('user');
      setUser(null);
      ToastManager.info('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isAuthenticated = !!user;

  const value = { user, login, register, logout, loading, isAuthenticated };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
