# 💬 Backend - Sistema de Chat do Marketplace

## 1. Criar Models

### `backend/app/models/chat.py`

```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    anuncio_id = Column(Integer, ForeignKey("anuncios.id"), nullable=False)
    comprador_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vendedor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    anuncio = relationship("Anuncio", back_populates="conversations")
    comprador = relationship("User", foreign_keys=[comprador_id])
    vendedor = relationship("User", foreign_keys=[vendedor_id])
    mensagens = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mensagem = Column(Text, nullable=False)
    lida = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="mensagens")
    sender = relationship("User")
```

## 2. Criar Schemas

### `backend/app/schemas/chat.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class MessageBase(BaseModel):
    mensagem: str

class MessageCreate(BaseModel):
    conversation_id: int
    mensagem: str

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    mensagem: str
    lida: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    anuncio_id: int

class ConversationResponse(BaseModel):
    id: int
    anuncio_id: int
    comprador_id: int
    vendedor_id: int
    ultima_mensagem: Optional[str] = None
    mensagens_nao_lidas: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationDetail(BaseModel):
    id: int
    anuncio_id: int
    comprador_id: int
    vendedor_id: int
    mensagens: List[MessageResponse]
    
    class Config:
        from_attributes = True

class UnreadCountResponse(BaseModel):
    unread_count: int
```

## 3. Criar Router

### `backend/app/routers/chat.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.chat import Conversation, Message
from app.models.anuncio import Anuncio
from app.models.user import User
from app.schemas.chat import (
    ConversationCreate, ConversationResponse, ConversationDetail,
    MessageCreate, MessageResponse, UnreadCountResponse
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar nova conversa com vendedor de um anúncio"""
    
    # Verificar se anúncio existe
    anuncio = db.query(Anuncio).filter(Anuncio.id == data.anuncio_id).first()
    if not anuncio:
        raise HTTPException(status_code=404, detail="Anúncio não encontrado")
    
    # Não pode criar conversa com próprio anúncio
    if anuncio.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Você não pode conversar com você mesmo")
    
    # Verificar se já existe conversa
    existing = db.query(Conversation).filter(
        Conversation.anuncio_id == data.anuncio_id,
        Conversation.comprador_id == current_user.id
    ).first()
    
    if existing:
        return existing
    
    # Criar nova conversa
    conversation = Conversation(
        anuncio_id=data.anuncio_id,
        comprador_id=current_user.id,
        vendedor_id=anuncio.user_id
    )
    
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    return conversation

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar todas as conversas do usuário"""
    
    conversations = db.query(Conversation).filter(
        (Conversation.comprador_id == current_user.id) |
        (Conversation.vendedor_id == current_user.id)
    ).order_by(Conversation.updated_at.desc()).all()
    
    result = []
    for conv in conversations:
        # Última mensagem
        last_message = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at.desc()).first()
        
        # Contar não lidas
        unread_count = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender_id != current_user.id,
            Message.lida == False
        ).count()
        
        result.append({
            "id": conv.id,
            "anuncio_id": conv.anuncio_id,
            "comprador_id": conv.comprador_id,
            "vendedor_id": conv.vendedor_id,
            "ultima_mensagem": last_message.mensagem if last_message else None,
            "mensagens_nao_lidas": unread_count,
            "created_at": conv.created_at
        })
    
    return result

@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver conversa completa com todas as mensagens"""
    
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    # Verificar se usuário faz parte da conversa
    if conversation.comprador_id != current_user.id and conversation.vendedor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Marcar mensagens como lidas
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.lida == False
    ).update({"lida": True})
    db.commit()
    
    return conversation

@router.post("/messages", response_model=MessageResponse)
async def send_message(
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enviar mensagem em uma conversa"""
    
    conversation = db.query(Conversation).filter(
        Conversation.id == data.conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    # Verificar se usuário faz parte da conversa
    if conversation.comprador_id != current_user.id and conversation.vendedor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Criar mensagem
    message = Message(
        conversation_id=data.conversation_id,
        sender_id=current_user.id,
        mensagem=data.mensagem
    )
    
    db.add(message)
    
    # Atualizar timestamp da conversa
    conversation.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(message)
    
    return message

@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Contar total de mensagens não lidas"""
    
    # Buscar conversas do usuário
    conversations = db.query(Conversation).filter(
        (Conversation.comprador_id == current_user.id) |
        (Conversation.vendedor_id == current_user.id)
    ).all()
    
    conversation_ids = [conv.id for conv in conversations]
    
    # Contar mensagens não lidas
    unread_count = db.query(Message).filter(
        Message.conversation_id.in_(conversation_ids),
        Message.sender_id != current_user.id,
        Message.lida == False
    ).count()
    
    return {"unread_count": unread_count}
```

## 4. Adicionar no main.py

### `backend/app/main.py`

```python
from app.routers import chat

app.include_router(chat.router)
```

## 5. Criar Migration

```bash
# Criar migration
alembic revision --autogenerate -m "add chat tables"

# Aplicar migration
alembic upgrade head
```

## 6. Adicionar Relationship no Anuncio

### `backend/app/models/anuncio.py`

```python
from sqlalchemy.orm import relationship

class Anuncio(Base):
    # ... campos existentes ...
    
    # Adicionar relationship
    conversations = relationship("Conversation", back_populates="anuncio")
```

## 7. Testar Endpoints

```bash
# Criar conversa
curl -X POST http://localhost:5000/chat/conversations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"anuncio_id": 1}'

# Listar conversas
curl http://localhost:5000/chat/conversations \
  -H "Authorization: Bearer TOKEN"

# Ver conversa
curl http://localhost:5000/chat/conversations/1 \
  -H "Authorization: Bearer TOKEN"

# Enviar mensagem
curl -X POST http://localhost:5000/chat/messages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversation_id": 1, "mensagem": "Olá!"}'

# Contar não lidas
curl http://localhost:5000/chat/unread-count \
  -H "Authorization: Bearer TOKEN"
```

## 8. Melhorias Futuras

### WebSocket para Tempo Real

```python
from fastapi import WebSocket
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
        self.active_connections[user_id].remove(websocket)
    
    async def send_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Processar mensagem
    except:
        manager.disconnect(websocket, user_id)
```

## ✅ Checklist de Implementação

- [ ] Criar models (Conversation, Message)
- [ ] Criar schemas
- [ ] Criar router com todos os endpoints
- [ ] Adicionar router no main.py
- [ ] Criar e aplicar migration
- [ ] Adicionar relationship no Anuncio
- [ ] Testar todos os endpoints
- [ ] (Opcional) Implementar WebSocket

---

**Sistema de chat completo e funcional!** 💬🎉
