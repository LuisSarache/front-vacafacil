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
- ✅ Exportação de dados (CSV)
- ✅ Seleção múltipla para ações em lote
- ✅ Persistência de dados no localStorage
- ✅ Context API para gerenciamento de estado

### 🥛 Controle de Produção
- ✅ Registro diário de ordenha
- ✅ Visualização por tabela e cards
- ✅ Filtros por data e período
- ✅ Métricas e comparativos
- ✅ Metas de produção
- ✅ Exportação de relatórios

### 💰 Controle Financeiro
- ✅ Registro de receitas e despesas
- ✅ Cálculo automático de lucro
- ✅ Margem de lucro
- ✅ Distribuição por categorias
- ✅ Visualização em tabelas
- ✅ Exportação de dados financeiros

### 🔐 Autenticação
- ✅ Login e registro de usuários
- ✅ Validação de formulários
- ✅ Hash de senhas (btoa)
- ✅ Persistência de sessão
- ✅ Rotas protegidas
- ✅ Proteção contra timing attacks

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
- ✅ Animações suaves (Framer Motion)
- ✅ Feedback visual
- ✅ Toast notifications

### ⚡ Performance e Qualidade
- ✅ Lazy loading de componentes
- ✅ Code splitting
- ✅ Cache com localStorage
- ✅ Otimização de re-renders
- ✅ Tratamento de erros robusto
- ✅ Validações de formulários
- ✅ Clean code e boas práticas

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
│   ├── context/         # Context API - Estado Global
│   │   ├── AuthContext.jsx          # Autenticação
│   │   ├── FinanceiroContext.jsx    # Finanças
│   │   ├── NotificationContext.jsx  # Notificações
│   │   ├── ProducaoContext.jsx      # Produção
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
│   ├── services/        # Serviços e APIs mock
│   │   └── mockApi.js
│   ├── utils/           # Funções utilitárias
│   │   ├── export.js      # Exportação CSV/JSON
│   │   └── validation.js  # Validações de formulário
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

**Versão Atual:** 1.5 (MVP Completo)

### Completo ✅
- ✅ CRUD de Vacas (Create, Read, Update, Delete)
- ✅ Sistema de Produção
- ✅ Controle Financeiro (Receitas/Despesas)
- ✅ Autenticação e Autorização
- ✅ Notificações em Tempo Real
- ✅ Dark Mode
- ✅ Validações de Formulários
- ✅ Exportação de Dados (CSV)
- ✅ Tratamento de Erros Robusto
- ✅ Persistência de Dados (localStorage)
- ✅ Context API para Estado Global
- ✅ Design Responsivo
- ✅ Animações e Transições

### Em Desenvolvimento 🚧
- 🚧 Reprodução e Saúde Animal
- 🚧 Relatórios PDF
- 🚧 Gráficos Interativos
- 🚧 Dashboard Analytics

### Planejado 📋
- 📋 Integração com Backend (API REST)
- 📋 App Mobile (React Native)
- 📋 Integrações IoT
- 📋 IA para Previsões de Produção
- 📋 Sistema de Backup em Nuvem

## 🔧 Melhorias Recentes

### v1.5 (Atual)
- ✅ Implementado VacasContext para CRUD completo
- ✅ Corrigido timing attack na autenticação
- ✅ Adicionado tratamento de erros em todos os try-catch
- ✅ Removido código não utilizado (ESLint clean)
- ✅ Otimizado performance com validações
- ✅ Melhorado UX com feedback visual
- ✅ Corrigido bugs de persistência de dados

## 🐛 Correções de Bugs

- ✅ Corrigido erro de timing attack no login
- ✅ Corrigido variáveis não utilizadas em catch blocks
- ✅ Corrigido importação dinâmica no Rebanho
- ✅ Corrigido campos opcionais em VacaDetalhes
- ✅ Corrigido persistência de dados no CRUD
- ✅ Corrigido validações de formulários

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

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

---

**VacaFácil** - Tecnologia Simples para o Campo 🌾

*Última atualização: Janeiro 2024*
