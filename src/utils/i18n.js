// Sistema de internacionalização simples
const translations = {
  'pt-BR': {
    // Labels comuns
    'Data': 'Data',
    'Descrição': 'Descrição', 
    'Categoria': 'Categoria',
    'Valor': 'Valor',
    'Vaca': 'Vaca',
    'Período': 'Período',
    'Quantidade (L)': 'Quantidade (L)',
    'Cancelar': 'Cancelar',
    'Salvar': 'Salvar',
    'Registrar': 'Registrar',
    'Exportar': 'Exportar',
    'Selecione': 'Selecione',
    
    // Períodos
    'Manhã': 'Manhã',
    'Tarde': 'Tarde',
    
    // Categorias
    'Venda': 'Venda',
    'Leite': 'Leite',
    'Animais': 'Animais',
    'Outros': 'Outros',
    'Alimentação': 'Alimentação',
    'Saúde': 'Saúde',
    'Funcionários': 'Funcionários',
    'Manutenção': 'Manutenção',
    
    // Mensagens
    'Nova Receita': 'Nova Receita',
    'Nova Despesa': 'Nova Despesa',
    'Registrar Ordenha': 'Registrar Ordenha',
    'Mensagem': 'Mensagem',
    'Raça': 'Raça'
  },
  'en': {
    // Labels comuns
    'Data': 'Date',
    'Descrição': 'Description',
    'Categoria': 'Category', 
    'Valor': 'Value',
    'Vaca': 'Cow',
    'Período': 'Period',
    'Quantidade (L)': 'Quantity (L)',
    'Cancelar': 'Cancel',
    'Salvar': 'Save',
    'Registrar': 'Register',
    'Exportar': 'Export',
    'Selecione': 'Select',
    
    // Períodos
    'Manhã': 'Morning',
    'Tarde': 'Afternoon',
    
    // Categorias
    'Venda': 'Sale',
    'Leite': 'Milk',
    'Animais': 'Animals',
    'Outros': 'Others',
    'Alimentação': 'Feed',
    'Saúde': 'Health',
    'Funcionários': 'Employees',
    'Manutenção': 'Maintenance',
    
    // Mensagens
    'Nova Receita': 'New Revenue',
    'Nova Despesa': 'New Expense',
    'Registrar Ordenha': 'Register Milking',
    'Mensagem': 'Message',
    'Raça': 'Breed'
  }
};

let currentLanguage = 'pt-BR';

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('vacafacil_language', lang);
  }
};

export const getLanguage = () => {
  const saved = localStorage.getItem('vacafacil_language');
  return saved || currentLanguage;
};

export const t = (key) => {
  const lang = getLanguage();
  return translations[lang]?.[key] || key;
};

// Hook para usar em componentes React
export const useTranslation = () => {
  return { t, setLanguage, getLanguage };
};

// Inicializar idioma salvo
const savedLang = localStorage.getItem('vacafacil_language');
if (savedLang && translations[savedLang]) {
  currentLanguage = savedLang;
}