// 📌 Sidebar reutilizável
// Esse componente é a barra lateral de navegação do sistema.
// Ela se adapta para desktop (fixa na esquerda) e para mobile (abre/fecha com botão).
// Também exibe informações do usuário autenticado e botões de navegação diferentes
// dependendo do tipo de usuário (psicólogo ou paciente).
 
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { NotificationPanel } from './NotificationPanel';
import {
  Menu,
  X,
  LogOut,
  BarChart3,
  User,
  Users,
  Milk,
  DollarSign,
  Heart,
  FileText,
  Settings,
  ShoppingCart,
  Crown,
  MessageCircle
} from 'lucide-react';
 
export const Sidebar = () => {
  // Estado que controla se o menu mobile está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
 
  // Pega usuário logado e função de logout do contexto
  const { user, logout } = useAuth();
  const { hasFeature } = useSubscription();
 
  // Hooks do React Router
  const navigate = useNavigate(); // navegação programática
  const location = useLocation(); // rota atual, útil para destacar link ativo
 
  // 📌 Função para fazer logout
  const handleLogout = () => {
    setIsOpen(false);   // fecha o menu mobile
    logout();           // limpa o contexto
    navigate('/', { replace: true }); // redireciona para home
  };
 
  // 📌 Links de navegação do VacaFácil
  const allNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/rebanho', label: 'Rebanho', icon: Users },
    { to: '/producao', label: 'Produção', icon: Milk },
    { to: '/financeiro', label: 'Financeiro', icon: DollarSign },
    { to: '/reproducao', label: 'Reprodução', icon: Heart },
    { to: '/relatorios', label: 'Relatórios', icon: FileText },
    { to: '/marketplace', label: 'Marketplace', icon: ShoppingCart, requiresFeature: 'marketplace' },
    { to: '/marketplace/chat', label: 'Chat', icon: MessageCircle, requiresFeature: 'marketplace' },
    { to: '/assinatura', label: 'Assinatura', icon: Crown },
    { to: '/configuracoes', label: 'Configurações', icon: Settings }
  ];

  // Filtrar links baseado no plano do usuário
  const navLinks = allNavLinks.filter(link => {
    if (link.requiresFeature) {
      return hasFeature(link.requiresFeature);
    }
    return true;
  });
 
  // 📌 Função para verificar se o link é o atual
  const isActive = (path) => location.pathname === path;
 
  return (
    <>
      {/* 📌 Botão Hamburguer para abrir/fechar menu em telas pequenas */}
     <button
  // Ao clicar, alterna o estado isOpen entre true e false
  onClick={() => setIsOpen(!isOpen)}
 
  // Tailwind CSS classes
  className="
    lg:hidden       /* Oculta o botão em telas grandes (largura >= lg) */
    fixed           /* Posiciona o botão fixo em relação à tela */
    top-4           /* Distância do topo: 1rem (16px) */
    left-4          /* Distância da esquerda: 1rem (16px) */
    z-50            /* Garante que o botão fique acima de outros elementos */
    bg-dark         /* Cor de fundo escura (classe customizada) */
    text-white      /* Cor do ícone/texto branca */
    p-2             /* Padding interno: 0.5rem (8px) */
    rounded-lg      /* Bordas arredondadas grandes */
    shadow-lg       /* Sombra grande para destaque */
  "
 
  // Atributo de acessibilidade, descrevendo o propósito do botão
  aria-label="Menu"
>
  {/* Alterna entre ícone de abrir (Menu) e fechar (X) */}
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>
 
      {/* 📌 Sidebar principal */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-black/70 shadow-xl transform transition-transform duration-300 z-40 ${
          // Se estiver aberta: fica visível (translate-x-0)
          // Se fechada em mobile: sai da tela à esquerda (-translate-x-full)
          // Em telas grandes (lg:), sempre visível (translate-x-0)
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 📌 Logo da aplicação */}
          <div className="flex items-center space-x-3 p-6 border-b border-white/10">
            {/* Logo com cantos arredondados */}
            <img src="/logo.png" alt="VacaFácil" className="w-10 h-10 rounded-lg" />
            <div>
              <span className="text-xl font-bold text-white">VacaFácil</span>
              <p className="text-xs text-white/60">Gestão de Fazendas</p>
            </div>
          </div>
 
          {/* 📌 Informações do usuário logado */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              {/* Avatar genérico com fundo gradiente */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{user?.name}</p>
                {/* Tipo de usuário */}
                <p className="text-xs text-white/60 capitalize">{user?.type}</p>
              </div>
              <NotificationPanel />
            </div>
          </div>
 
          {/* 📌 Navegação (lista de links) */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive(link.to)
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              
              {/* Links bloqueados (mostrar com cadeado) */}
              {allNavLinks.filter(link => link.requiresFeature && !hasFeature(link.requiresFeature)).map((link) => (
                <li key={`blocked-${link.to}`}>
                  <div className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/40 cursor-not-allowed">
                    <link.icon size={20} />
                    <span>{link.label}</span>
                    <Crown size={14} className="ml-auto" />
                  </div>
                </li>
              ))}
            </ul>
          </nav>
 
          {/* 📌 Botão de Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
 
      {/* 📌 Overlay (fundo escuro) quando o menu mobile está aberto */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)} // Clica fora para fechar
        />
      )}
    </>
  );
};
 
 