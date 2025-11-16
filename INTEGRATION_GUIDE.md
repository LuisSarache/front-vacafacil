# 🔗 Guia de Integração: Frontend ↔ Backend VacaFácil

## 📋 Pré-requisitos

### Backend
- ✅ FastAPI rodando em `http://localhost:8000`
- ✅ PostgreSQL configurado
- ✅ CORS habilitado para `http://localhost:5173`
- ✅ JWT Authentication implementado

### Frontend
- ✅ Vite configurado
- ✅ Variáveis de ambiente configuradas
- ✅ Serviços de API criados

## ⚙️ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

```env
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=VacaFácil
VITE_APP_VERSION=2.0.0
```

### 2. Instalar Dependências Adicionais (se necessário)

```bash
npm install axios  # Opcional, já temos fetch nativo
```

## 🔄 Migração do Mock para API Real

### 1. Atualizar AuthContext

```javascript
// src/context/AuthContext.jsx
import { apiService } from '../services/api';

export function AuthProvider({ children }) {
  // ... código existente ...

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Trocar mockApi.login por apiService.login
      const response = await apiService.login(email, password);
      
      // Buscar dados completos do usuário
      const userData = await apiService.getCurrentUser();
      
      setUser(userData);
      return response;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      // Trocar mockApi.register por apiService.register
      const response = await apiService.register(userData);
      
      // Login automático após registro
      await login(userData.email, userData.password);
      
      return response;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ... resto do código ...
}
```

### 2. Atualizar VacasContext

```javascript
// src/context/VacasContext.jsx
import { apiService } from '../services/api';
import { useVacas } from '../hooks/useApi';

export function VacasProvider({ children }) {
  const [vacas, setVacas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar vacas da API
  const loadVacas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVacas();
      setVacas(data);
    } catch (error) {
      console.error('Erro ao carregar vacas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVaca = async (vaca) => {
    try {
      const newVaca = await apiService.createVaca(vaca);
      setVacas(prev => [...prev, newVaca]);
      return newVaca;
    } catch (error) {
      console.error('Erro ao adicionar vaca:', error);
      throw error;
    }
  };

  const updateVaca = async (id, vaca) => {
    try {
      const updatedVaca = await apiService.updateVaca(id, vaca);
      setVacas(prev => prev.map(v => v.id === id ? updatedVaca : v));
      return updatedVaca;
    } catch (error) {
      console.error('Erro ao atualizar vaca:', error);
      throw error;
    }
  };

  const deleteVaca = async (id) => {
    try {
      await apiService.deleteVaca(id);
      setVacas(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Erro ao excluir vaca:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadVacas();
  }, []);

  // ... resto do código ...
}
```

### 3. Atualizar FinanceiroContext

```javascript
// src/context/FinanceiroContext.jsx
import { useFinanceiroApi } from '../hooks/useApi';

export function FinanceiroProvider({ children }) {
  const {
    receitas,
    despesas,
    loading,
    addReceita,
    addDespesa,
    deleteReceita,
    deleteDespesa,
    refetch
  } = useFinanceiroApi();

  const getTotalReceitas = () => 
    receitas.reduce((sum, r) => sum + parseFloat(r.valor), 0);
  
  const getTotalDespesas = () => 
    despesas.reduce((sum, d) => sum + parseFloat(d.valor), 0);
  
  const getLucro = () => getTotalReceitas() - getTotalDespesas();

  return (
    <FinanceiroContext.Provider value={{
      receitas,
      despesas,
      loading,
      addReceita,
      addDespesa,
      deleteReceita,
      deleteDespesa,
      getTotalReceitas,
      getTotalDespesas,
      getLucro,
      refetch
    }}>
      {children}
    </FinanceiroContext.Provider>
  );
}
```

## 🚀 Usando os Novos Hooks

### 1. Componente com Hook useApi

```javascript
// src/pages/Rebanho.jsx
import { useVacas } from '../hooks/useApi';

export const Rebanho = () => {
  const { data: vacas, loading, error, refetch } = useVacas();

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Rebanho ({vacas?.length || 0} vacas)</h1>
      {vacas?.map(vaca => (
        <div key={vaca.id}>
          <h3>{vaca.nome}</h3>
          <p>Raça: {vaca.raca}</p>
        </div>
      ))}
    </div>
  );
};
```

### 2. Dashboard com Dados da API

```javascript
// src/pages/Dashboard.jsx
import { useDashboard } from '../hooks/useApi';

export const Dashboard = () => {
  const { data: dashboardData, loading } = useDashboard();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <h3>Produção Hoje</h3>
          <p>{dashboardData?.producao_hoje}L</p>
        </Card>
        <Card>
          <h3>Vacas Ativas</h3>
          <p>{dashboardData?.vacas_ativas}</p>
        </Card>
        {/* ... mais cards ... */}
      </div>
    </div>
  );
};
```

## 🔧 Tratamento de Erros

### 1. Error Boundary

```javascript
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo deu errado!</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. Interceptor Global de Erros

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Token expirado
    localStorage.removeItem('token');
    window.location.href = '/login';
    return 'Sessão expirada. Faça login novamente.';
  }
  
  if (error.response?.status === 403) {
    return 'Você não tem permissão para esta ação.';
  }
  
  if (error.response?.status >= 500) {
    return 'Erro interno do servidor. Tente novamente mais tarde.';
  }
  
  return error.response?.data?.detail || error.message || 'Erro desconhecido';
};
```

## 📊 Monitoramento e Debug

### 1. Interceptor de Requisições

```javascript
// src/services/api.js (adicionar ao ApiService)
async request(endpoint, options = {}) {
  const startTime = Date.now();
  
  try {
    console.log(`🚀 API Request: ${options.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(url, config);
    const duration = Date.now() - startTime;
    
    console.log(`✅ API Response: ${response.status} (${duration}ms)`);
    
    return await response.json();
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ API Error: ${endpoint} (${duration}ms)`, error);
    throw error;
  }
}
```

### 2. Loading States Globais

```javascript
// src/context/LoadingContext.jsx
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = (message = 'Carregando...') => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
    setLoadingMessage('');
  };

  return (
    <LoadingContext.Provider value={{ loading, loadingMessage, showLoading, hideLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <LoadingSpinner />
            <p>{loadingMessage}</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
```

## 🧪 Testes de Integração

### 1. Teste de API

```javascript
// src/tests/api.test.js
import { apiService } from '../services/api';

describe('API Integration', () => {
  test('should login successfully', async () => {
    const response = await apiService.login('test@example.com', 'password');
    expect(response.access_token).toBeDefined();
  });

  test('should fetch vacas', async () => {
    const vacas = await apiService.getVacas();
    expect(Array.isArray(vacas)).toBe(true);
  });
});
```

## 🚀 Deploy e Produção

### 1. Variáveis de Ambiente de Produção

```env
# .env.production
VITE_API_URL=https://api.vacafacil.com
VITE_APP_NAME=VacaFácil
VITE_APP_VERSION=2.0.0
```

### 2. Build Script

```json
// package.json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:prod": "vite build --mode production",
    "preview": "vite preview"
  }
}
```

## ✅ Checklist de Integração

- [ ] Backend rodando em http://localhost:8000
- [ ] CORS configurado no backend
- [ ] Variáveis de ambiente configuradas
- [ ] AuthContext migrado para API real
- [ ] VacasContext migrado para API real
- [ ] FinanceiroContext migrado para API real
- [ ] Hooks personalizados implementados
- [ ] Tratamento de erros configurado
- [ ] Loading states implementados
- [ ] Testes de integração criados
- [ ] Error boundary implementado
- [ ] Monitoramento de requisições ativo

## 🎯 Próximos Passos

1. **Implementar Cache**: Redis ou cache local para melhor performance
2. **Offline Support**: Service Worker para funcionar offline
3. **Real-time Updates**: WebSockets para atualizações em tempo real
4. **Otimização**: Lazy loading e code splitting
5. **Monitoramento**: Sentry ou similar para tracking de erros

---

**🎉 Parabéns!** Seu frontend VacaFácil está agora totalmente integrado com o backend FastAPI! 🐄✨