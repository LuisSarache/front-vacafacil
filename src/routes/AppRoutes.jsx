// Importação de rotas do React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 
// Importa contexto de autenticação
import { useAuth } from '../context/AuthContext';
 
// Componentes reutilizáveis
import { Sidebar } from '../components/Sidebar';
import { PublicNavbar } from '../components/PublicNavbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ScrollToTop } from '../components/ScrollToTop';
 
// Páginas públicas
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Contact } from '../pages/Contact';
 
/* ==============================
   Componente de rota protegida
   ============================== */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Obtém usuário e estado de carregamento
 
  if (loading) return <LoadingSpinner size="lg" />; // Mostra spinner enquanto carrega
  if (!user) return <Navigate to="/login" replace />; // Redireciona não autenticados para login
 
  return (
    <div className="min-h-screen flex">
      <Sidebar /> {/* Sidebar lateral sempre visível */}
      <main className="flex-1 lg:ml-64 p-8">
        {children} {/* Conteúdo da página protegida */}
      </main>
    </div>
  );
};
 
/* ==============================
   Componente de rota pública
   ============================== */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto os dados do usuário estão sendo carregados, mostra spinner
  if (loading) return <LoadingSpinner size="lg" />;

  // Se o usuário já está logado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Usuário não logado pode acessar a página pública
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
 
/* ==============================
   Componente Dashboard condicional
   ============================== */
const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-dark mb-6">Dashboard</h1>
      <p className="text-medium">Bem-vindo ao sistema VacaFácil!</p>
    </div>
  );
};
 
/* ==============================
   Configuração de rotas da aplicação
   ============================== */
export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
 
        {/* ==============================
           Rotas Públicas
           ============================== */}
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
       
        <Route path="/about" element={
          <PublicRoute>
            <About />
          </PublicRoute>
        } />

         <Route path="/contact" element={
          <PublicRoute>
            <Contact />
          </PublicRoute>
        } />
       
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
       
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

       
        {/* ==============================
           Rotas Protegidas
           ============================== */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard /> 
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};
 