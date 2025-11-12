# 🚀 Guia Completo: Backend VacaFácil com FastAPI

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Configuração do Ambiente](#configuração-do-ambiente)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Banco de Dados](#banco-de-dados)
5. [Autenticação JWT](#autenticação-jwt)
6. [APIs REST](#apis-rest)
7. [Validações e Schemas](#validações-e-schemas)
8. [Middleware e CORS](#middleware-e-cors)
9. [Testes](#testes)
10. [Deploy](#deploy)

## 🎯 Visão Geral

Este guia mostra como criar um backend robusto para o VacaFácil usando:
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM para Python
- **JWT** - Autenticação segura
- **Pydantic** - Validação de dados
- **Alembic** - Migrações de banco

## 🛠️ Configuração do Ambiente

### 1. Criar Projeto Backend

```bash
# Criar diretório
mkdir backend-vacafacil
cd backend-vacafacil

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Criar requirements.txt
```

### 2. Dependências (requirements.txt)

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
python-decouple==3.8
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

### 3. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 4. Configurar PostgreSQL

```bash
# Instalar PostgreSQL (Windows)
# Baixar de: https://www.postgresql.org/download/

# Criar banco de dados
psql -U postgres
CREATE DATABASE vacafacil;
CREATE USER vacafacil_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE vacafacil TO vacafacil_user;
\q
```

## 📁 Estrutura do Projeto

```
backend-vacafacil/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicação principal
│   ├── config.py              # Configurações
│   ├── database.py            # Conexão com banco
│   ├── models/                # Modelos SQLAlchemy
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vaca.py
│   │   ├── producao.py
│   │   ├── financeiro.py
│   │   ├── reproducao.py
│   │   └── marketplace.py
│   ├── schemas/               # Schemas Pydantic
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vaca.py
│   │   ├── producao.py
│   │   ├── financeiro.py
│   │   ├── reproducao.py
│   │   └── marketplace.py
│   ├── routers/               # Rotas da API
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── vacas.py
│   │   ├── producao.py
│   │   ├── financeiro.py
│   │   ├── reproducao.py
│   │   └── marketplace.py
│   ├── services/              # Lógica de negócio
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── vaca_service.py
│   │   ├── producao_service.py
│   │   ├── financeiro_service.py
│   │   ├── reproducao_service.py
│   │   └── marketplace_service.py
│   ├── utils/                 # Utilitários
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── dependencies.py
│   │   └── exceptions.py
│   └── tests/                 # Testes
│       ├── __init__.py
│       ├── test_auth.py
│       ├── test_vacas.py
│       └── conftest.py
├── alembic/                   # Migrações
├── .env                       # Variáveis de ambiente
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md
```

## 🗄️ Banco de Dados

### 1. Configuração (app/config.py)

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://vacafacil_user:sua_senha_aqui@localhost/vacafacil"
    
    # JWT
    secret_key: str = "sua_chave_secreta_super_segura_aqui"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
```

### 2. Conexão (app/database.py)

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 3. Modelo User (app/models/user.py)

```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    nome = Column(String, nullable=False)
    telefone = Column(String)
    fazenda = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    foto_perfil = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### 4. Modelo Vaca (app/models/vaca.py)

```python
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Vaca(Base):
    __tablename__ = "vacas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nome = Column(String, nullable=False)
    raca = Column(String, nullable=False)
    idade = Column(Integer)
    peso = Column(Float)
    producao_media = Column(Float)
    status = Column(String, default="ativa")
    observacoes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    owner = relationship("User", back_populates="vacas")
    producoes = relationship("Producao", back_populates="vaca")
```

### 5. Modelo Produção (app/models/producao.py)

```python
from sqlalchemy import Column, Integer, Float, Date, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base

class Producao(Base):
    __tablename__ = "producoes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vaca_id = Column(Integer, ForeignKey("vacas.id"), nullable=False)
    data = Column(Date, nullable=False)
    quantidade_manha = Column(Float, default=0)
    quantidade_tarde = Column(Float, default=0)
    quantidade_total = Column(Float)
    observacoes = Column(String)

    # Relacionamentos
    user = relationship("User")
    vaca = relationship("Vaca", back_populates="producoes")
```

## 🔐 Autenticação JWT

### 1. Utilitários de Segurança (app/utils/security.py)

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None
```

### 2. Dependências (app/utils/dependencies.py)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    email = verify_token(token)
    if email is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user
```

### 3. Schemas de Autenticação (app/schemas/user.py)

```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    nome: str
    telefone: Optional[str] = None
    fazenda: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    fazenda: Optional[str] = None
    foto_perfil: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    foto_perfil: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
```

### 4. Rotas de Autenticação (app/routers/auth.py)

```python
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar se usuário já existe
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Criar usuário
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        nome=user.nome,
        telefone=user.telefone,
        fazenda=user.fazenda,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
```

## 📊 APIs REST

### 1. API de Vacas (app/routers/vacas.py)

```python
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.vaca import Vaca
from app.schemas.vaca import VacaCreate, VacaUpdate, VacaResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/vacas", tags=["vacas"])

@router.post("/", response_model=VacaResponse)
def create_vaca(
    vaca: VacaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_vaca = Vaca(**vaca.dict(), user_id=current_user.id)
    db.add(db_vaca)
    db.commit()
    db.refresh(db_vaca)
    return db_vaca

@router.get("/", response_model=List[VacaResponse])
def get_vacas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: str = Query(None),
    raca: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Vaca).filter(Vaca.user_id == current_user.id)
    
    if search:
        query = query.filter(Vaca.nome.ilike(f"%{search}%"))
    if raca:
        query = query.filter(Vaca.raca == raca)
    if status:
        query = query.filter(Vaca.status == status)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{vaca_id}", response_model=VacaResponse)
def get_vaca(
    vaca_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vaca = db.query(Vaca).filter(
        Vaca.id == vaca_id,
        Vaca.user_id == current_user.id
    ).first()
    
    if not vaca:
        raise HTTPException(status_code=404, detail="Vaca not found")
    
    return vaca

@router.put("/{vaca_id}", response_model=VacaResponse)
def update_vaca(
    vaca_id: int,
    vaca_update: VacaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vaca = db.query(Vaca).filter(
        Vaca.id == vaca_id,
        Vaca.user_id == current_user.id
    ).first()
    
    if not vaca:
        raise HTTPException(status_code=404, detail="Vaca not found")
    
    for field, value in vaca_update.dict(exclude_unset=True).items():
        setattr(vaca, field, value)
    
    db.commit()
    db.refresh(vaca)
    return vaca

@router.delete("/{vaca_id}")
def delete_vaca(
    vaca_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vaca = db.query(Vaca).filter(
        Vaca.id == vaca_id,
        Vaca.user_id == current_user.id
    ).first()
    
    if not vaca:
        raise HTTPException(status_code=404, detail="Vaca not found")
    
    db.delete(vaca)
    db.commit()
    return {"message": "Vaca deleted successfully"}
```

### 2. Schemas de Vaca (app/schemas/vaca.py)

```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VacaBase(BaseModel):
    nome: str
    raca: str
    idade: Optional[int] = None
    peso: Optional[float] = None
    producao_media: Optional[float] = None
    status: str = "ativa"
    observacoes: Optional[str] = None

class VacaCreate(VacaBase):
    pass

class VacaUpdate(BaseModel):
    nome: Optional[str] = None
    raca: Optional[str] = None
    idade: Optional[int] = None
    peso: Optional[float] = None
    producao_media: Optional[float] = None
    status: Optional[str] = None
    observacoes: Optional[str] = None

class VacaResponse(VacaBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
```

## 🚀 Aplicação Principal (app/main.py)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base
from app.routers import auth, users, vacas, producao, financeiro, reproducao, marketplace

# Criar tabelas
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="VacaFácil API",
    description="API para gestão de fazendas leiteiras",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(vacas.router)
app.include_router(producao.router)
app.include_router(financeiro.router)
app.include_router(reproducao.router)
app.include_router(marketplace.router)

@app.get("/")
def read_root():
    return {"message": "VacaFácil API - Sistema de Gestão de Fazendas Leiteiras"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

## 🧪 Testes

### 1. Configuração de Testes (app/tests/conftest.py)

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_user():
    return {
        "email": "test@example.com",
        "nome": "Test User",
        "password": "testpass123"
    }
```

### 2. Testes de Autenticação (app/tests/test_auth.py)

```python
def test_register_user(client, test_user):
    response = client.post("/auth/register", json=test_user)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["nome"] == test_user["nome"]

def test_login_user(client, test_user):
    # Registrar usuário
    client.post("/auth/register", json=test_user)
    
    # Login
    response = client.post("/auth/login", data={
        "username": test_user["email"],
        "password": test_user["password"]
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
```

## 🚀 Deploy

### 1. Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: vacafacil
      POSTGRES_USER: vacafacil_user
      POSTGRES_PASSWORD: sua_senha_aqui
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://vacafacil_user:sua_senha_aqui@db/vacafacil
    volumes:
      - ./app:/app/app

volumes:
  postgres_data:
```

### 3. Executar

```bash
# Desenvolvimento
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Docker
docker-compose up --build

# Produção
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📝 Próximos Passos

1. **Implementar todas as rotas** seguindo o padrão mostrado
2. **Configurar Alembic** para migrações
3. **Adicionar validações** mais robustas
4. **Implementar cache** com Redis
5. **Adicionar logs** estruturados
6. **Configurar CI/CD**
7. **Documentação automática** (Swagger/OpenAPI)
8. **Monitoramento** e métricas

## 🔗 Integração com Frontend

### Atualizar Frontend para usar API

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Autenticação
  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('token', this.token);
    return data;
  }

  // Vacas
  async getVacas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vacas?${queryString}`);
  }

  async createVaca(vaca) {
    return this.request('/vacas', {
      method: 'POST',
      body: JSON.stringify(vaca),
    });
  }

  async updateVaca(id, vaca) {
    return this.request(`/vacas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaca),
    });
  }

  async deleteVaca(id) {
    return this.request(`/vacas/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
```

---

**🎉 Parabéns!** Agora você tem um guia completo para implementar o backend do VacaFácil com FastAPI. Este backend será robusto, seguro e escalável, perfeito para suportar todas as funcionalidades do frontend.