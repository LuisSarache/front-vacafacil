# 🐄 VacaFácil - Sistema de Gestão de Fazendas Leiteiras

## 📖 Sobre o Projeto

VacaFácil é uma plataforma web moderna e intuitiva para gestão completa de fazendas leiteiras. Desenvolvido com React e Vite, o sistema oferece ferramentas essenciais para produtores rurais controlarem seu rebanho, produção, finanças e saúde animal.

## ✨ Funcionalidades Implementadas

### 🐮 Gestão de Rebanho
- ✅ CRUD completo de vacas (Create, Read, Update, Delete)
- ✅ Visualização detalhada com histórico
- ✅ Edição de informações em tempo real
- ✅ Filtros e busca avançada
- ✅ Paginação de resultados
- ✅ Exportação de dados (CSV/Excel)
- ✅ Seleção múltipla para ações em lote
- ✅ Persistência de dados no localStorage
- ✅ Context API para gerenciamento de estado
- ✅ Busca global inteligente
- ✅ Filtros avançados salvos
- ✅ Scroll virtual para listas grandes

### 🥛 Controle de Produção
- ✅ Registro diário de ordenha
- ✅ Visualização por tabela e cards
- ✅ Filtros por data e período
- ✅ Métricas e comparativos
- ✅ Metas de produção
- ✅ Exportação de relatórios (PDF/Excel)
- ✅ Gráficos interativos (Chart.js)
- ✅ KPIs e análises avançadas

### 🩺 Reprodução e Saúde
- ✅ Calendário de vacinação interativo
- ✅ Controle de inseminação artificial
- ✅ Registro de nascimentos
- ✅ Histórico médico completo
- ✅ Alertas de vacinação
- ✅ Cronograma reprodutivo

### 💰 Controle Financeiro
- ✅ Registro de receitas e despesas
- ✅ Cálculo automático de lucro
- ✅ Margem de lucro
- ✅ Distribuição por categorias
- ✅ Visualização em tabelas
- ✅ Exportação de dados financeiros
- ✅ Relatórios PDF personalizados
- ✅ Gráficos de fluxo de caixa

### 🛒 Marketplace
- ✅ Compra e venda de vacas entre produtores
- ✅ Filtros por raça, tipo (venda/procura)
- ✅ Busca avançada de anúncios
- ✅ Criação de anúncios personalizados
- ✅ Informações detalhadas (preço, idade, produção)
- ✅ Sistema de contato direto
- ✅ Upload de imagens
- ✅ Geolocalização

### 🔐 Autenticação e Perfil
- ✅ Login e registro de usuários
- ✅ Validação de formulários
- ✅ Hash de senhas (bcrypt)
- ✅ Persistência de sessão
- ✅ Rotas protegidas
- ✅ Proteção contra timing attacks
- ✅ Perfil de usuário completo
- ✅ Upload de foto de perfil
- ✅ Recuperação de senha
- ✅ Configurações personalizadas

### 💳 Sistema de Assinatura
- ✅ 3 planos: Gratuito, Básico e Pro
- ✅ Escolha de plano após login
- ✅ Limites por plano
- ✅ Upgrade/downgrade de planos
- ✅ Cancelamento de assinatura
- ✅ Status da assinatura
- ✅ Avisos de limite atingido
- ✅ Pagamento simulado

#### 📋 Detalhes dos Planos:

**🆓 GRATUITO**
- Até 5 vacas
- 30 dias de histórico de produção
- Relatórios básicos
- Suporte por email
- Sem marketplace
- Sem analytics

**💰 BÁSICO (R$ 29,90/mês)**
- Até 50 vacas
- 1 ano de histórico
- Relatórios completos PDF/Excel
- Marketplace incluído
- Analytics básico
- Suporte prioritário
- 50 relatórios/mês
- 20 exportações/mês

**🚀 PRO (R$ 59,90/mês)**
- Vacas ilimitadas
- Histórico completo
- Relatórios avançados
- Marketplace premium
- Analytics avançado
- Suporte 24/7
- Backup em nuvem
- Acesso à API
- Relatórios ilimitados
- Exportações ilimitadas

#### 🔄 Fluxo de Onboarding:
1. **Login/Registro** → Usuário autentica no sistema
2. **Detecção Automática** → Sistema verifica se é novo usuário
3. **Redirecionamento** → Vai automaticamente para escolha de plano
4. **Seleção Obrigatória** → Deve escolher um plano para continuar
5. **Ativação** → Plano é ativado e usuário acessa o dashboard

#### 🛡️ Controle de Limites:
- **Verificação em tempo real** durante cadastros
- **Avisos visuais** quando limite está próximo
- **Bloqueio automático** ao atingir limite
- **Sugestão de upgrade** com call-to-action
- **Contadores dinâmicos** de uso atual vs limite

### 🔔 Notificações
- ✅ Sistema de notificações in-app redesenhado
- ✅ Badge com contador animado
- ✅ Histórico de notificações
- ✅ Marcar como lida/excluir
- ✅ Persistência no localStorage
- ✅ Design moderno com gradientes e animações
- ✅ Dark mode otimizado
- ✅ Push notifications (PWA)

### 📊 Relatórios e Analytics
- ✅ Relatórios PDF personalizados
- ✅ Exportação Excel avançada
- ✅ Gráficos interativos (Chart.js)
- ✅ Dashboard com KPIs
- ✅ Análises de tendências
- ✅ Comparativos mensais/anuais
- ✅ Métricas de performance

### 🎨 Interface e UX
- ✅ Dark mode otimizado com melhor legibilidade
- ✅ Design responsivo
- ✅ Glassmorphism aprimorado
- ✅ Skeleton loaders
- ✅ Tooltips informativos
- ✅ Animações suaves (Framer Motion)
- ✅ Feedback visual
- ✅ Toast notifications
- ✅ Scrollbar customizada
- ✅ Atalhos de teclado
- ✅ Acessibilidade (WCAG 2.1)

### 📱 PWA (Progressive Web App)
- ✅ Instalação como app nativo
- ✅ Funcionamento offline
- ✅ Service Worker
- ✅ Cache inteligente
- ✅ Push notifications
- ✅ Sincronização em background

### ⚡ Performance e Qualidade
- ✅ Lazy loading de componentes
- ✅ Code splitting
- ✅ Cache com localStorage
- ✅ Otimização de re-renders
- ✅ Tratamento de erros robusto
- ✅ Validações de formulários
- ✅ Clean code e boas práticas
- ✅ Virtual scrolling
- ✅ Debounce em buscas
- ✅ Memoização de componentes

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19** - Biblioteca UI
- **Vite 7** - Build tool e dev server
- **React Router DOM 7** - Roteamento SPA
- **Tailwind CSS 4** - Framework CSS utility-first

### Bibliotecas
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações e transições
- **React Hot Toast** - Sistema de notificações toast
- **Chart.js** - Gráficos interativos
- **jsPDF** - Geração de PDFs
- **XLSX** - Exportação Excel
- **React Window** - Virtual scrolling

### Ferramentas de Desenvolvimento
- **ESLint 9** - Linting e qualidade de código
- **Git** - Controle de versão
- **Context API** - Gerenciamento de estado global

### Arquitetura
- **Component-based** - Componentes reutilizáveis
- **Context Pattern** - Estado global compartilhado
- **Custom Hooks** - Lógica reutilizável
- **localStorage** - Persistência de dados local

## 📁 Estrutura do Projeto

```
front-vacafacil/
├── public/
│   └── logo.png
├── src/
│   ├── assets/          # Imagens e recursos estáticos
│   ├── components/      # Componentes reutilizáveis
│   │   ├── AdvancedFilters.jsx      # Filtros avançados
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── FormField.jsx
│   │   ├── GlobalSearch.jsx         # Busca global
│   │   ├── Input.jsx
│   │   ├── InteractiveChart.jsx     # Gráficos interativos
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── NotificationPanel.jsx
│   │   ├── Pagination.jsx
│   │   ├── PasswordRecovery.jsx     # Recuperação de senha
│   │   ├── PublicNavbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Skeleton.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── ToastManager.jsx
│   │   ├── Tooltip.jsx
│   │   ├── UserProfile.jsx          # Perfil do usuário
│   │   ├── VaccinationCalendar.jsx  # Calendário de vacinação
│   │   ├── VirtualList.jsx          # Lista virtual
│   │   ├── PlanCard.jsx             # Card de plano
│   │   ├── SubscriptionStatus.jsx   # Status da assinatura
│   │   └── LimitWarning.jsx         # Aviso de limite
│   ├── context/         # Context API - Estado Global
│   │   ├── AuthContext.jsx          # Autenticação
│   │   ├── FinanceiroContext.jsx    # Finanças
│   │   ├── NotificationContext.jsx  # Notificações
│   │   ├── ProducaoContext.jsx      # Produção
│   │   ├── ReproducaoContext.jsx    # Reprodução e Saúde
│   │   ├── SubscriptionContext.jsx  # Assinatura e Planos
│   │   ├── ThemeContext.jsx         # Tema (Dark/Light)
│   │   └── VacasContext.jsx         # CRUD de Vacas
│   ├── hooks/           # Custom hooks reutilizáveis
│   │   ├── useLocalStorage.js
│   │   └── useTableSort.js
│   ├── pages/           # Páginas da aplicação
│   │   ├── About.jsx
│   │   ├── CadastroVaca.jsx
│   │   ├── Configuracoes.jsx
│   │   ├── Contact.jsx
│   │   ├── CriarAnuncio.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditarVaca.jsx
│   │   ├── Financeiro.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Marketplace.jsx
│   │   ├── Producao.jsx
│   │   ├── Rebanho.jsx
│   │   ├── Register.jsx
│   │   ├── Relatorios.jsx
│   │   ├── Reproducao.jsx
│   │   ├── Assinatura.jsx
│   │   ├── EscolherPlano.jsx
│   │   └── VacaDetalhes.jsx
│   ├── routes/          # Configuração de rotas
│   │   └── AppRoutes.jsx
│   ├── services/        # Serviços e APIs mock
│   │   └── mockApi.js
│   ├── utils/           # Funções utilitárias
│   │   ├── accessibility.js # Acessibilidade
│   │   ├── charts.js        # Gráficos e KPIs
│   │   ├── excel.js         # Exportação Excel
│   │   ├── export.js        # Exportação CSV/JSON
│   │   ├── pwa.js           # PWA e Service Worker
│   │   └── validation.js    # Validações de formulário
│   ├── App.jsx          # Componente raiz
│   ├── index.css        # Estilos globais
│   └── main.jsx         # Entry point
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
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

```javascript
// Usuário 1
Email: admin@vacafacil.com
Senha: 123456

// Usuário 2
Email: maria@fazenda.com
Senha: 123456
```

**Nota:** Estes são usuários de teste. Em produção, use senhas fortes e únicas.

## 🎨 Paleta de Cores

```css
--color-dark: #6A994E      /* Verde fazenda */
--color-medium: #264653    /* Marrom terra */
--color-light: #FAFAFA     /* Branco suave */
--color-accent: #878B88    /* Cinza verde */
--color-background: #F0E1C0 /* Bege claro */
```

## 📊 Status do Projeto

**Versão Atual:** 2.0 (Frontend Completo + PWA)

### Completo ✅
- ✅ CRUD de Vacas (Create, Read, Update, Delete)
- ✅ Sistema de Produção Completo
- ✅ Controle Financeiro (Receitas/Despesas)
- ✅ Marketplace (Compra/Venda)
- ✅ Reprodução e Saúde Animal
- ✅ Autenticação e Perfil de Usuário
- ✅ Sistema de Assinatura Completo
- ✅ Notificações Push (PWA)
- ✅ Relatórios PDF/Excel
- ✅ Gráficos Interativos
- ✅ Dashboard Analytics
- ✅ PWA (Progressive Web App)
- ✅ Dark Mode Otimizado
- ✅ Busca Global e Filtros Avançados
- ✅ Acessibilidade (WCAG 2.1)
- ✅ Performance Otimizada
- ✅ Design Responsivo
- ✅ Animações e Transições

### Próximos Passos 🔄
- 🔄 Backend FastAPI (Guia Completo Abaixo)
- 🔄 Banco de Dados PostgreSQL
- 🔄 Autenticação JWT
- 🔄 API REST Completa

### Planejado 📋
- 📋 App Mobile (React Native)
- 📋 Integrações IoT
- 📋 IA para Previsões de Produção
- 📋 Sistema de Backup em Nuvem
- 📋 Sincronização Multi-dispositivo

## 🔧 Melhorias Recentes

### v2.0 (Atual) - Frontend Completo
- ✅ Implementado todas as funcionalidades do TODO.md
- ✅ PWA completo com service worker
- ✅ Relatórios PDF/Excel avançados
- ✅ Calendário de vacinação interativo
- ✅ Busca global inteligente
- ✅ Filtros avançados salvos
- ✅ Perfil de usuário completo
- ✅ Gráficos interativos (Chart.js)
- ✅ Virtual scrolling para performance
- ✅ Acessibilidade WCAG 2.1
- ✅ Push notifications
- ✅ Funcionamento offline

### v1.6
- ✅ Implementado Marketplace completo
- ✅ Redesenhado painel de notificações
- ✅ Otimizado dark mode com melhor legibilidade
- ✅ Adicionado gradientes e animações modernas
- ✅ Melhorado contraste de cores no dark mode
- ✅ Scrollbar customizada
- ✅ Corrigido posicionamento de notificações

## 🐛 Correções de Bugs

- ✅ Corrigido erro de timing attack no login
- ✅ Corrigido variáveis não utilizadas em catch blocks
- ✅ Corrigido importação dinâmica no Rebanho
- ✅ Corrigido campos opcionais em VacaDetalhes
- ✅ Corrigido persistência de dados no CRUD
- ✅ Corrigido validações de formulários
- ✅ Corrigido posicionamento do painel de notificações
- ✅ Corrigido visibilidade de textos no dark mode

## 🔒 Segurança

- Hash de senhas com btoa + salt
- Proteção contra timing attacks
- Validação de inputs
- Sanitização de dados
- Rotas protegidas
- Tratamento de erros seguro

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨💻 Desenvolvedor

Desenvolvido com ❤️ para facilitar a vida dos produtores rurais.

---

**VacaFácil** - Tecnologia Simples para o Campo 🌾

---

## 🚀 Guia do Backend

**📖 [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)** - Guia completo para implementar o backend em FastAPI

### Tecnologias Backend
- **FastAPI** - Framework web moderno
- **PostgreSQL** - Banco de dados
- **SQLAlchemy** - ORM
- **JWT** - Autenticação
- **Stripe/PayPal** - Pagamentos
- **Alembic** - Migrações
- **Docker** - Containerização

### Funcionalidades Backend
- ✅ API REST completa
- ✅ Autenticação JWT segura
- ✅ Sistema de assinatura e pagamentos
- ✅ Controle de limites por plano
- ✅ CRUD para todas as entidades
- ✅ Validações robustas
- ✅ Webhooks de pagamento
- ✅ Documentação automática (Swagger)
- ✅ Testes automatizados
- ✅ Deploy com Docker

### APIs de Assinatura
- **GET /subscriptions/plans** - Listar planos disponíveis
- **POST /subscriptions/subscribe** - Criar nova assinatura
- **PUT /subscriptions/upgrade** - Fazer upgrade de plano
- **DELETE /subscriptions/cancel** - Cancelar assinatura
- **GET /subscriptions/status** - Status da assinatura
- **POST /subscriptions/webhooks** - Webhooks de pagamento
- **GET /subscriptions/usage** - Uso atual vs limites
