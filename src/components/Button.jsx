// Componente de botão reutilizável
export const Button = ({ 
  children, // Conteúdo interno do botão (texto ou ícones)
  variant = 'primary', // Define o estilo visual (padrão: primary)
  size = 'md', // Define o tamanho do botão (padrão: md)
  loading = false, // Indica se o botão está em estado de carregamento
  className = '', // Permite adicionar classes extras personalizadas
  ...props // Captura outras props (ex: onClick, type, etc.)
}) => {
  // Classes base aplicadas em todos os botões
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  // Estilos de acordo com o tipo de botão
  const variants = {
    primary: 'bg-dark text-white hover:bg-medium focus:ring-medium shadow-md hover:shadow-lg',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 shadow-sm',
    outline: 'bg-transparent border-2 border-dark text-dark hover:bg-dark hover:text-white focus:ring-medium'
  };
  
  // Tamanhos disponíveis para o botão
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      // Montagem final das classes CSS dinamicamente com base nas props
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={loading} // Desabilita o botão quando está carregando
      {...props} // Permite passar outras propriedades (ex: onClick, type)
    >
      {/* Renderiza "Carregando..." caso esteja em loading, senão mostra o conteúdo */}
      {loading ? 'Carregando...' : children}
    </button>
  );
};