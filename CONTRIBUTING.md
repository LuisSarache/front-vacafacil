# 🤝 Guia de Contribuição - VacaFácil

## Como Contribuir

### 1. Fork e Clone
```bash
git clone https://github.com/seu-usuario/front-vacafacil.git
cd front-vacafacil
npm install
```

### 2. Crie uma Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### 3. Faça suas Alterações
- Siga os padrões de código
- Adicione testes se aplicável
- Documente mudanças significativas

### 4. Commit
```bash
git commit -m "feat: adiciona nova funcionalidade"
```

### Padrão de Commits
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### 5. Push e Pull Request
```bash
git push origin feature/nova-funcionalidade
```

## Padrões de Código

### Nomenclatura
- Componentes: `PascalCase`
- Funções: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

### Estrutura de Componentes
```jsx
import { useState } from 'react';

export const MyComponent = ({ prop1 }) => {
  const [state, setState] = useState();
  
  const handleClick = () => {};
  
  return <div>...</div>;
};
```

## Code Review

Todas as contribuições passam por revisão. Certifique-se de:
- ✅ Código limpo e legível
- ✅ Sem console.logs
- ✅ Testes passando
- ✅ Documentação atualizada
