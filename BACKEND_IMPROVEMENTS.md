# 🚀 Guia de Melhorias para o Backend VacaFácil

## 📋 Índice
1. [Autenticação e Segurança](#autenticação-e-segurança)
2. [Upload de Arquivos](#upload-de-arquivos)
3. [Paginação e Filtros](#paginação-e-filtros)
4. [WebSocket para Notificações](#websocket-para-notificações)
5. [Validações](#validações)
6. [Performance](#performance)
7. [Testes](#testes)

---

## 1. Autenticação e Segurança

### 1.1 Refresh Token

**Problema Atual:** Token JWT expira e usuário precisa fazer login novamente.

**Solução:** Implementar refresh token para renovar automaticamente.

```python
# backend/app/routers/auth.py
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

router = APIRouter()

# Configurações
SECRET_KEY = "sua-chave-secreta-super-segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Validar usuário e senha
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    # Criar tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token inválido")
        
        email = payload.get("sub")
        new_access_token = create_access_token(data={"sub": email})
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
```

### 1.2 Retornar Dados do Usuário no Login

**Problema Atual:** Frontend precisa fazer 2 requisições (login + getCurrentUser).

**Solução:** Retornar dados do usuário junto com o token.

```python
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "nome": user.nome,
            "telefone": user.telefone,
            "fazenda": user.fazenda
        }
    }
```

---

## 2. Upload de Arquivos

### 2.1 Upload de Imagens das Vacas

```python
# backend/app/routers/vacas.py
from fastapi import APIRouter, File, UploadFile, Depends
from pathlib import Path
import shutil
import uuid

router = APIRouter()

UPLOAD_DIR = Path("uploads/vacas")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/{vaca_id}/upload-image")
async def upload_vaca_image(
    vaca_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validar tipo de arquivo
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    # Validar tamanho (max 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Imagem muito grande (max 5MB)")
    
    # Gerar nome único
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Salvar arquivo
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Atualizar banco de dados
    vaca = db.query(Vaca).filter(Vaca.id == vaca_id, Vaca.user_id == current_user.id).first()
    if not vaca:
        raise HTTPException(status_code=404, detail="Vaca não encontrada")
    
    vaca.foto_url = f"/uploads/vacas/{unique_filename}"
    db.commit()
    
    return {"foto_url": vaca.foto_url}

# Servir arquivos estáticos
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

### 2.2 Otimização de Imagens

```python
from PIL import Image
import io

def optimize_image(image_bytes: bytes, max_size=(800, 800)) -> bytes:
    """Redimensiona e otimiza imagem"""
    image = Image.open(io.BytesIO(image_bytes))
    
    # Converter para RGB se necessário
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")
    
    # Redimensionar mantendo proporção
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Salvar otimizado
    output = io.BytesIO()
    image.save(output, format="JPEG", quality=85, optimize=True)
    return output.getvalue()

@router.post("/{vaca_id}/upload-image")
async def upload_vaca_image(vaca_id: int, file: UploadFile = File(...)):
    contents = await file.read()
    
    # Otimizar imagem
    optimized_image = optimize_image(contents)
    
    # Salvar...
```

---

## 3. Paginação e Filtros

### 3.1 Paginação Padrão

```python
# backend/app/schemas/pagination.py
from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int

# backend/app/routers/vacas.py
@router.get("/", response_model=PaginatedResponse[VacaResponse])
async def get_vacas(
    page: int = 1,
    limit: int = 50,
    search: str = None,
    raca: str = None,
    status: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Query base
    query = db.query(Vaca).filter(Vaca.user_id == current_user.id)
    
    # Filtros
    if search:
        query = query.filter(
            (Vaca.nome.ilike(f"%{search}%")) | 
            (Vaca.numero.ilike(f"%{search}%"))
        )
    
    if raca:
        query = query.filter(Vaca.raca == raca)
    
    if status:
        query = query.filter(Vaca.status == status)
    
    # Total
    total = query.count()
    
    # Paginação
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit
    )
```

### 3.2 Ordenação

```python
@router.get("/")
async def get_vacas(
    page: int = 1,
    limit: int = 50,
    sort_by: str = "nome",
    sort_order: str = "asc",
    db: Session = Depends(get_db)
):
    query = db.query(Vaca)
    
    # Ordenação
    if sort_order == "desc":
        query = query.order_by(getattr(Vaca, sort_by).desc())
    else:
        query = query.order_by(getattr(Vaca, sort_by).asc())
    
    # ...
```

---

## 4. WebSocket para Notificações

### 4.1 Configuração WebSocket

```python
# backend/app/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
    
    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)

manager = ConnectionManager()

# backend/app/main.py
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Processar mensagem se necessário
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
```

### 4.2 Enviar Notificações

```python
# Quando criar uma nova produção
@router.post("/producao/")
async def create_producao(producao: ProducaoCreate, current_user: User = Depends(get_current_user)):
    # Criar produção...
    
    # Enviar notificação via WebSocket
    await manager.send_personal_message({
        "type": "nova_producao",
        "message": f"Nova produção registrada: {producao.quantidade}L",
        "data": producao.dict()
    }, current_user.id)
    
    return producao
```

---

## 5. Validações

### 5.1 Validações Customizadas

```python
# backend/app/schemas/vaca.py
from pydantic import BaseModel, validator, Field

class VacaCreate(BaseModel):
    numero: str = Field(..., min_length=1, max_length=50)
    nome: str = Field(..., min_length=2, max_length=100)
    raca: str
    nascimento: date
    peso: float = Field(None, ge=0, le=2000)
    
    @validator('raca')
    def validate_raca(cls, v):
        racas_validas = ['Holandesa', 'Jersey', 'Gir', 'Girolando', 
                         'Pardo Suíço', 'Guzerá', 'Nelore', 'Brahman']
        if v not in racas_validas:
            raise ValueError(f'Raça deve ser uma de: {", ".join(racas_validas)}')
        return v
    
    @validator('nascimento')
    def validate_nascimento(cls, v):
        if v > date.today():
            raise ValueError('Data de nascimento não pode ser futura')
        return v
```

---

## 6. Performance

### 6.1 Cache com Redis

```python
# backend/app/cache.py
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(expire_time=300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Gerar chave do cache
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Tentar buscar do cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Executar função
            result = await func(*args, **kwargs)
            
            # Salvar no cache
            redis_client.setex(cache_key, expire_time, json.dumps(result))
            
            return result
        return wrapper
    return decorator

# Uso
@router.get("/dashboard/stats")
@cache_result(expire_time=60)  # Cache por 1 minuto
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    # Cálculos pesados...
    return stats
```

### 6.2 Índices no Banco de Dados

```python
# backend/app/models/vaca.py
from sqlalchemy import Index

class Vaca(Base):
    __tablename__ = "vacas"
    
    id = Column(Integer, primary_key=True)
    numero = Column(String(50), nullable=False)
    nome = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Índices para melhor performance
    __table_args__ = (
        Index('idx_vaca_user_numero', 'user_id', 'numero'),
        Index('idx_vaca_user_nome', 'user_id', 'nome'),
    )
```

---

## 7. Testes

### 7.1 Testes Unitários

```python
# backend/tests/test_vacas.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_vaca():
    response = client.post(
        "/vacas/",
        json={
            "numero": "001",
            "nome": "Mimosa",
            "raca": "Holandesa",
            "nascimento": "2020-01-01"
        },
        headers={"Authorization": f"Bearer {test_token}"}
    )
    assert response.status_code == 201
    assert response.json()["nome"] == "Mimosa"

def test_get_vacas_pagination():
    response = client.get(
        "/vacas/?page=1&limit=10",
        headers={"Authorization": f"Bearer {test_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) <= 10
```

---

## 8. Controle de Acesso por Plano

### 8.1 Middleware de Verificação de Plano

```python
# backend/app/dependencies/subscription.py
from fastapi import Depends, HTTPException
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.subscription import Subscription

def require_feature(feature: str):
    """
    Dependency para verificar se usuário tem acesso a uma funcionalidade
    """
    async def check_feature(current_user: User = Depends(get_current_user)):
        # Buscar assinatura do usuário
        subscription = current_user.subscription
        
        if not subscription:
            raise HTTPException(
                status_code=403,
                detail="Você precisa escolher um plano primeiro"
            )
        
        # Verificar se o plano tem a funcionalidade
        plan_features = {
            'free': {
                'marketplace': False,
                'analytics': False,
                'backup': False,
                'api': False
            },
            'basic': {
                'marketplace': True,
                'analytics': 'basico',
                'backup': False,
                'api': False
            },
            'pro': {
                'marketplace': True,
                'analytics': 'avancado',
                'backup': True,
                'api': True
            }
        }
        
        plan_id = subscription.plan_id
        if plan_id not in plan_features:
            raise HTTPException(status_code=403, detail="Plano inválido")
        
        if not plan_features[plan_id].get(feature):
            raise HTTPException(
                status_code=403,
                detail=f"Esta funcionalidade não está disponível no plano {plan_id}. Faça upgrade!"
            )
        
        return current_user
    
    return check_feature
```

### 8.2 Proteger Rotas do Marketplace

```python
# backend/app/routers/marketplace.py
from app.dependencies.subscription import require_feature

@router.get("/")
async def get_anuncios(
    current_user: User = Depends(require_feature('marketplace')),
    db: Session = Depends(get_db)
):
    # Apenas usuários com plano que inclui marketplace podem acessar
    anuncios = db.query(Anuncio).all()
    return anuncios

@router.post("/")
async def create_anuncio(
    anuncio: AnuncioCreate,
    current_user: User = Depends(require_feature('marketplace')),
    db: Session = Depends(get_db)
):
    # Criar anúncio...
    pass
```

### 8.3 Verificar Limites do Plano

```python
# backend/app/dependencies/subscription.py
def check_limit(resource: str):
    """
    Verifica se usuário atingiu o limite do plano
    """
    async def verify_limit(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        subscription = current_user.subscription
        
        limits = {
            'free': {'vacas': 5, 'relatorios_mes': 5, 'exportacoes_mes': 2},
            'basic': {'vacas': 50, 'relatorios_mes': 50, 'exportacoes_mes': 20},
            'pro': {'vacas': -1, 'relatorios_mes': -1, 'exportacoes_mes': -1}  # -1 = ilimitado
        }
        
        plan_limits = limits.get(subscription.plan_id, limits['free'])
        limit = plan_limits.get(resource, 0)
        
        if limit == -1:  # Ilimitado
            return current_user
        
        # Contar uso atual
        if resource == 'vacas':
            current_usage = db.query(Vaca).filter(Vaca.user_id == current_user.id).count()
        elif resource == 'relatorios_mes':
            # Contar relatórios do mês atual
            current_usage = db.query(Relatorio).filter(
                Relatorio.user_id == current_user.id,
                Relatorio.created_at >= datetime.now().replace(day=1)
            ).count()
        
        if current_usage >= limit:
            raise HTTPException(
                status_code=403,
                detail=f"Limite de {resource} atingido para seu plano. Faça upgrade!"
            )
        
        return current_user
    
    return verify_limit

# Uso
@router.post("/vacas/")
async def create_vaca(
    vaca: VacaCreate,
    current_user: User = Depends(check_limit('vacas')),
    db: Session = Depends(get_db)
):
    # Criar vaca...
    pass
```

---

## 📊 Resumo de Prioridades

### Alta Prioridade
1. ✅ Retornar user no login
2. ✅ Refresh token
3. ✅ Paginação nas listagens
4. ✅ Upload de imagens
5. ✅ **Controle de acesso por plano**

### Média Prioridade
5. ✅ Filtros e busca
6. ✅ Validações sincronizadas
7. ✅ Cache Redis

### Baixa Prioridade
8. ✅ WebSocket
9. ✅ Testes automatizados
10. ✅ Otimização de imagens

---

## 🚀 Próximos Passos

1. Implementar refresh token
2. Adicionar paginação em todas as listagens
3. Implementar upload de imagens
4. Adicionar cache Redis
5. Criar testes automatizados
6. Implementar WebSocket para notificações em tempo real

---

**Desenvolvido para VacaFácil** 🐄
