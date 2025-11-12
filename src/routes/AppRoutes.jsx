// Importação de rotas do React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
 
// Importa contextos
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
 
// Componentes reutilizáveis
import { Sidebar } from '../components/Sidebar';
import { PublicNavbar } from '../components/PublicNavbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ScrollToTop } from '../components/ScrollToTop';
 
// Páginas públicas
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/Register').then(m => ({ default: m.Register })));
const Contact = lazy(() => import('../pages/Contact').then(m => ({ default: m.Contact })));

// Páginas do sistema
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Rebanho = lazy(() => import('../pages/Rebanho').then(m => ({ default: m.Rebanho })));
const CadastroVaca = lazy(() => import('../pages/CadastroVaca').then(m => ({ default: m.CadastroVaca })));
const VacaDetalhes = lazy(() => import('../pages/VacaDetalhes').then(m => ({ default: m.VacaDetalhes })));
const EditarVaca = lazy(() => import('../pages/EditarVaca').then(m => ({ default: m.EditarVaca })));
const Producao = lazy(() => import('../pages/Producao').then(m => ({ default: m.Producao })));
const Financeiro = lazy(() => import('../pages/Financeiro').then(m => ({ default: m.Financeiro })));
const Reproducao = lazy(() => import('../pages/Reproducao').then(m => ({ default: m.Reproducao })));
const Relatorios = lazy(() => import('../pages/Relatorios').then(m => ({ default: m.Relatorios })));

const Configuracoes = lazy(() => import('../pages/Configuracoes').then(m => ({ default: m.Configuracoes })));
const Marketplace = lazy(() => import('../pages/Marketplace').then(m => ({ default: m.Marketplace })));
const CriarAnuncio = lazy(() => import('../pages/CriarAnuncio').then(m => ({ default: m.CriarAnuncio })));
const Assinatura = lazy(() => import('../pages/Assinatura').then(m => ({ default: m.Assinatura })));
const EscolherPlano = lazy(() => import('../pages/EscolherPlano').then(m => ({ default: m.EscolherPlano })));
 
/* ==============================
   Componente de rota protegida
   ============================== */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth(); // Obtém estado de autenticação e carregamento
  const { isDark } = useTheme(); // Obtém estado do tema
  const { isNewUser, loading: subLoading } = useSubscription();
  const location = useLocation();
 
  if (authLoading || subLoading) return <LoadingSpinner size="lg" />; // Mostra spinner enquanto carrega
  if (!isAuthenticated) return <Navigate to="/login" replace />; // Redireciona não autenticados para login
  
  // Se é novo usuário e não está na página de escolher plano, redireciona
  if (isNewUser && location.pathname !== '/escolher-plano') {
    return <Navigate to="/escolher-plano" replace />;
  }
 
  // Layout especial para página de escolher plano (sem sidebar)
  if (location.pathname === '/escolher-plano') {
    return (
      <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen flex dashboard-container ${isDark ? 'dark' : ''}`}>
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
export const PublicRoute = ({ children, fullWidth = false }) => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto os dados do usuário estão sendo carregados, mostra spinner
  if (loading) return <LoadingSpinner size="lg" />;

  // Se o usuário já está logado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Usuário não logado pode acessar a página pública
  return (
    <div className="min-h-screen public-page">
      <PublicNavbar />
      {fullWidth ? (
        children
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      )}
    </div>
  );
};
 

 
/* ==============================
   Configuração de rotas da aplicação
   ============================== */
export const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner size="lg" />}>
      <Routes>
 
        {/* ==============================
           Rotas Públicas
           ============================== */}
        <Route path="/" element={
          <PublicRoute fullWidth>
            <Home />
          </PublicRoute>
        } />
       

       <Route path="/Home" element={
          <PublicRoute fullWidth>
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
        
        <Route path="/rebanho" element={
          <ProtectedRoute>
            <Rebanho /> 
          </ProtectedRoute>
        } />
        
        <Route path="/rebanho/novo" element={
          <ProtectedRoute>
            <CadastroVaca /> 
          </ProtectedRoute>
        } />
        
        <Route path="/rebanho/:id" element={
          <ProtectedRoute>
            <VacaDetalhes /> 
          </ProtectedRoute>
        } />
        
        <Route path="/rebanho/editar/:id" element={
          <ProtectedRoute>
            <EditarVaca /> 
          </ProtectedRoute>
        } />
        
        <Route path="/producao" element={
          <ProtectedRoute>
            <Producao /> 
          </ProtectedRoute>
        } />
        
        <Route path="/financeiro" element={
          <ProtectedRoute>
            <Financeiro /> 
          </ProtectedRoute>
        } />
        
        <Route path="/reproducao" element={
          <ProtectedRoute>
            <Reproducao /> 
          </ProtectedRoute>
        } />
        
        <Route path="/relatorios" element={
          <ProtectedRoute>
            <Relatorios /> 
          </ProtectedRoute>
        } />

        
        <Route path="/configuracoes" element={
          <ProtectedRoute>
            <Configuracoes /> 
          </ProtectedRoute>
        } />
        
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <Marketplace /> 
          </ProtectedRoute>
        } />
        
        <Route path="/marketplace/novo" element={
          <ProtectedRoute>
            <CriarAnuncio /> 
          </ProtectedRoute>
        } />
        
        <Route path="/assinatura" element={
          <ProtectedRoute>
            <Assinatura /> 
          </ProtectedRoute>
        } />
        
        <Route path="/escolher-plano" element={
          <ProtectedRoute>
            <EscolherPlano /> 
          </ProtectedRoute>
        } />
      </Routes>
      </Suspense>
    </Router>
  );
};
 