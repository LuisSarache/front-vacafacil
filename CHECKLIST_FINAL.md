# ✅ Checklist Final - Integração Backend VacaFácil

## 🎯 Configurações Obrigatórias

### ✅ 1. Backend rodando em localhost:5000
```bash
# No backend FastAPI
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### ✅ 2. Frontend configurado para localhost:5000
```env
# .env (já configurado)
VITE_API_URL=http://localhost:5000
```

### ✅ 3. CORS configurado no backend
```python
# app/main.py (Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ✅ 4. Login usando form-data
```javascript
// src/services/api.js (já implementado)
async login(email, password) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await fetch(`${this.baseURL}/auth/login`, {
    method: 'POST',
    body: formData, // Form-data, não JSON
  });
  // ...
}
```

### ✅ 5. Token JWT no header Authorization: Bearer {token}
```javascript
// src/services/api.js (já implementado)
async request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    },
    ...options,
  };
  // ...
}
```

### ✅ 6. Tratamento de erro 401 → redirect login
```javascript
// src/services/api.js (já implementado)
async request(endpoint, options = {}) {
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        this.handleUnauthorized(); // Remove token e redireciona
      }
      // ...
    }
  } catch (error) {
    // ...
  }
}

handleUnauthorized() {
  this.removeToken();
  window.location.href = '/login';
}
```

## 🚀 Como Testar a Integração

### 1. Iniciar Backend
```bash
cd backend-vacafacil
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

uvicorn app.main:app --reload --port 5000
```

### 2. Iniciar Frontend
```bash
cd front-vacafacil
npm run dev
```

### 3. Testar Endpoints

#### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@vacafacil.com&password=123456"
```

#### Endpoint Protegido
```bash
curl -X GET http://localhost:5000/vacas/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Configuração do Backend (FastAPI)

### 1. Estrutura Mínima
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS - OBRIGATÓRIO
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Validar credenciais
    # Retornar: {"access_token": "token", "token_type": "bearer"}
    pass

@app.get("/vacas/")
async def get_vacas(current_user: User = Depends(get_current_user)):
    # Retornar lista de vacas do usuário
    pass
```

### 2. Executar Backend
```bash
pip install fastapi uvicorn python-multipart
uvicorn app.main:app --reload --port 5000
```

## 🧪 Testes de Validação

### ✅ Teste 1: Backend Rodando
- Acesse: http://localhost:5000/docs
- Deve mostrar a documentação Swagger

### ✅ Teste 2: CORS Funcionando
- Abra o console do navegador em http://localhost:5173
- Execute: `fetch('http://localhost:5000/docs')`
- Não deve dar erro de CORS

### ✅ Teste 3: Login Form-Data
- Faça login no frontend
- Verifique no Network tab se usa `Content-Type: multipart/form-data`

### ✅ Teste 4: Token JWT
- Após login, verifique se o token está no localStorage
- Requisições subsequentes devem incluir `Authorization: Bearer ...`

### ✅ Teste 5: Redirect 401
- Remova o token do localStorage
- Tente acessar uma página protegida
- Deve redirecionar para /login

## 🔍 Debug e Troubleshooting

### Problema: CORS Error
```python
# Adicione no backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporário para debug
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problema: 401 Unauthorized
- Verifique se o token está sendo enviado
- Verifique se o token não expirou
- Verifique se o header está correto: `Authorization: Bearer token`

### Problema: Form-data não funciona
```javascript
// NÃO incluir Content-Type para form-data
const response = await fetch(url, {
  method: 'POST',
  body: formData, // Deixar o browser definir o Content-Type
});
```

## 📋 Status Final

- ✅ Backend: localhost:5000
- ✅ Frontend: localhost:5173 → localhost:5000
- ✅ CORS: Configurado
- ✅ Login: Form-data
- ✅ JWT: Bearer token
- ✅ 401: Redirect login

## 🎉 Pronto para Produção!

Quando todos os itens estiverem ✅, sua integração estará completa e funcionando perfeitamente!