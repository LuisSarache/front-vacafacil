import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ToastManager } from "../components/ToastManager";
import { validateEmail, validatePassword, validateRequired } from "../utils/validation";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmName: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
    
    setLoading(true);
    try {
      const { user, token } = await mockApi.register({
        ...formData,
        type: "produtor",
        phone: "11999999999",
        cpfCnpj: "000.000.000-00",
        location: "Brasil",
        herdSize: "10"
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Welcome */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex items-center justify-center p-12"
      >
        <div className="max-w-md text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-dark mb-6"
          >
            Bem-vindo ao VacaFácil!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Junte-se a centenas de produtores que já modernizaram suas fazendas.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Cadastro rápido e gratuito</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Gestão completa do rebanho</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Relatórios automáticos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Suporte especializado</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-dark mb-2">VacaFácil</h2>
            <p className="text-gray-600">Crie sua conta gratuita</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6 bg-white shadow-lg border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome completo"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  placeholder="Seu nome completo"
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
                  label="Nome da Fazenda"
                  value={formData.farmName}
                  onChange={handleInputChange("farmName")}
                  placeholder="Nome da sua propriedade"
                  required
                />
                
                <Input
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                
                <Input
                  label="Confirme a senha"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  placeholder="Digite novamente"
                  required
                />

                <Button type="submit" loading={loading} className="w-full">
                  Criar Conta Gratuita
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Já possui conta?</p>
                <Link to="/login" className="text-dark font-semibold hover:text-medium">
                  Fazer login
                </Link>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};