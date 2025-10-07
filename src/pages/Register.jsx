//! importação das bibliotecas e componentes
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ToastManager } from "../components/ToastManager";
import { validateEmail, validatePassword, validatePhone, validateRequired } from "../utils/validation";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    cpfCnpj: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    farmName: "",
    location: "",
    herdSize: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRequired(formData.name)) {
      ToastManager.error("Nome é obrigatório");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      ToastManager.error("E-mail inválido");
      return;
    }
    
    if (!validatePassword(formData.password)) {
      ToastManager.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      ToastManager.error("Senhas não coincidem");
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      ToastManager.error("Telefone inválido");
      return;
    }
    
    setLoading(true);
    try {
      const { user, token } = await mockApi.register({
        ...formData,
        type: "produtor", // registro único
      });
      await login(user, token);
      ToastManager.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      ToastManager.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <Card className="glassmorphism w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            Criar Conta
          </h1>
          <p className="text-medium/70">Cadastre-se como Produtor de Leite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome completo"
            value={formData.name}
            onChange={handleInputChange("name")}
            placeholder="Seu nome completo"
            required
          />
          <Input
            label="CPF ou CNPJ"
            value={formData.cpfCnpj}
            onChange={handleInputChange("cpfCnpj")}
            placeholder="Digite seu CPF ou CNPJ"
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            placeholder="seu@email.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            placeholder="sua senha"
            required
          />
          <Input
            label="Confirme sua senha"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            placeholder="Confirme sua senha"
            required
          />
          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            placeholder="Digite seu telefone"
            required
          />
          <Input
            label="Nome da Fazenda"
            value={formData.farmName}
            onChange={handleInputChange("farmName")}
            placeholder="Digite o nome da fazenda"
            required
          />
          <Input
            label="Localização"
            value={formData.location}
            onChange={handleInputChange("location")}
            placeholder="Cidade/Estado"
            required
          />
        

          <Button type="submit" loading={loading} className="w-full">
            Criar Conta
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-medium/70">Já possui conta?</p>
          <Link to="/login" className="text-accent font-bold hover:text-dark transition-colors">
            Faça login!
          </Link>
        </div>
      </Card>
    </div>
  );
};
