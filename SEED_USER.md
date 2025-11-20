# 🌱 Criar Usuário de Teste no Backend

## Script Python para criar usuário padrão

Crie o arquivo `seed_user.py` no backend:

```python
from app.database import SessionLocal
from app.models import User
from app.core.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    
    # Verificar se usuário já existe
    existing = db.query(User).filter(User.email == "teste@vacafacil.com").first()
    if existing:
        print("✅ Usuário teste@vacafacil.com já existe!")
        return
    
    # Criar usuário de teste
    user = User(
        email="teste@vacafacil.com",
        nome="Teste",
        telefone="11999999999",
        fazenda="Fazenda Teste",
        hashed_password=get_password_hash("123456"),
        is_active=True
    )
    
    db.add(user)
    db.commit()
    print("✅ Usuário criado com sucesso!")
    print("📧 Email: teste@vacafacil.com")
    print("🔑 Senha: 123456")
    
    db.close()

if __name__ == "__main__":
    create_test_user()
```

## Como executar

```bash
# No diretório do backend
python seed_user.py
```

## Ou via SQL direto

```sql
-- Conectar ao PostgreSQL e executar:
INSERT INTO users (email, nome, telefone, fazenda, hashed_password, is_active)
VALUES (
    'teste@vacafacil.com',
    'Teste',
    '11999999999',
    'Fazenda Teste',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpWR.KjSu', -- senha: 123456
    true
);
```

## Credenciais

```
Email: teste@vacafacil.com
Senha: 123456
```
