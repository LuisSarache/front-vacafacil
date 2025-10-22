# 🐄 VacaFácil - Sistema de Gestão de Fazendas Leiteiras

## 📖 Sobre o Projeto

VacaFácil é uma plataforma web moderna e intuitiva para gestão completa de fazendas leiteiras. Desenvolvido com React e Vite, o sistema oferece ferramentas essenciais para produtores rurais controlarem seu rebanho, produção, finanças e saúde animal.

## ✨ Funcionalidades Implementadas

### 🐮 Gestão de Rebanho
- ✅ CRUD completo de vacas
- ✅ Visualização detalhada com histórico
- ✅ Edição de informações
- ✅ Filtros e busca avançada
- ✅ Paginação de resultados
- ✅ Exportação de dados (CSV)
- ✅ Seleção múltipla para ações em lote

### 🥛 Controle de Produção
- ✅ Registro diário de ordenha
- ✅ Visualização por tabela e cards
- ✅ Filtros por data e período
- ✅ Métricas e comparativos
- ✅ Metas de produção
- ✅ Exportação de relatórios

### 🔐 Autenticação
- ✅ Login e registro de usuários
- ✅ Validação de formulários
- ✅ Hash de senhas
- ✅ Persistência de sessão
- ✅ Rotas protegidas

### 🔔 Notificações
- ✅ Sistema de notificações in-app
- ✅ Badge com contador
- ✅ Histórico de notificações
- ✅ Marcar como lida/excluir
- ✅ Persistência no localStorage

### 🎨 Interface e UX
- ✅ Dark mode funcional
- ✅ Design responsivo
- ✅ Glassmorphism
- ✅ Skeleton loaders
- ✅ Tooltips informativos
- ✅ Animações suaves
- ✅ Feedback visual

### ⚡ Performance
- ✅ Lazy loading de componentes
- ✅ Code splitting
- ✅ Cache com localStorage
- ✅ Otimização de re-renders

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19** - Biblioteca UI
- **Vite** - Build tool
- **React Router DOM 7** - Roteamento
- **Tailwind CSS 4** - Estilização

### Bibliotecas
- **Lucide React** - Ícones
- **Framer Motion** - Animações
- **React Hot Toast** - Notificações toast

### Ferramentas
- **ESLint** - Linting
- **Git** - Controle de versão

## 📁 Estrutura do Projeto

```
front-vacafacil/
├── public/
│   └── logo.png
├── src/
│   ├── assets/          # Imagens e recursos
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── FormField.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── NotificationPanel.jsx
│   │   ├── Pagination.jsx
│   │   ├── PublicNavbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Skeleton.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── ToastManager.jsx
│   │   └── Tooltip.jsx
│   ├── context/         # Context API
│   │   ├── AuthContext.jsx
│       ├── FinanceiroContext.jsx    
│   │   ├── NotificationContext.jsx
│   │   ├── ProducaoContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/           # Custom hooks
│   │   ├── useLocalStorage.js
│   │   └── useTableSort.js
│   ├── pages/           # Páginas da aplicação
│   │   ├── About.jsx
│   │   ├── CadastroVaca.jsx
│   │   ├── Configuracoes.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditarVaca.jsx
│   │   ├── Financeiro.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Producao.jsx
│   │   ├── Rebanho.jsx
│   │   ├── Register.jsx
│   │   ├── Relatorios.jsx
│   │   ├── Reproducao.jsx
│   │   └── VacaDetalhes.jsx
│   ├── routes/          # Configuração de rotas
│   │   └── AppRoutes.jsx
│   ├── services/        # Serviços e APIs
│   │   └── mockApi.js
│   ├── utils/           # Utilitários
│   │   ├── export.js
│   │   └── validation.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── PROJETO.md
├── README.md
├── TODO.md
└── vite.config.js
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/front-vacafacil.git

# Entre na pasta
cd front-vacafacil

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 👥 Usuários de Teste

```
Email: admin@vacafacil.com
Senha: 123456

Email: maria@fazenda.com
Senha: 123456
```

## 🎨 Paleta de Cores

```css
--color-dark: #6A994E      /* Verde fazenda */
--color-medium: #264653    /* Marrom terra */
--color-light: #FAFAFA     /* Branco suave */
--color-accent: #878B88    /* Cinza verde */
--color-background: #F0E1C0 /* Bege claro */
```

## 📊 Status do Projeto

**Versão Atual:** 1.0 (MVP)

### Completo ✅
- CRUD de Vacas
- Sistema de Produção
- Autenticação
- Notificações
- Dark Mode
- Validações
- Exportação de Dados

### Em Desenvolvimento 🚧
- Controle Financeiro
- Reprodução e Saúde
- Relatórios PDF
- Gráficos Interativos

### Planejado 📋
- App Mobile
- Integrações IoT
- Analytics Avançado
- IA para Previsões


## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para facilitar a vida dos produtores rurais.

---

**VacaFácil** - Tecnologia Simples para o Campo 🌾
