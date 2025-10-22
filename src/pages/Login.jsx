import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ToastManager } from "../components/ToastManager";
import { validateEmail, validatePassword } from "../utils/validation";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      ToastManager.error("E-mail inválido");
      return;
    }
    
    if (!validatePassword(formData.password)) {
      ToastManager.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }
    
    setLoading(true);

    try {
      const { user, token } = await mockApi.login(
        formData.email,
        formData.password
      );
      await login(user, token);
      ToastManager.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      ToastManager.error(error.message || "Erro ao fazer login");
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
        className="hidden lg:flex items-center justify-center  p-12"
      >
        <div className="max-w-md text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-dark mb-6"
          >
            Bem-vindo de volta!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Continue gerenciando sua fazenda com eficiência e praticidade.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Acesse seu dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Gerencie seu rebanho</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-gray-700">Visualize relatórios</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
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
            <p className="text-gray-600">Entre na sua conta</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6 bg-white shadow-lg border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
                
                <Input
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Sua senha"
                  required
                />
                
                <Button type="submit" loading={loading} className="w-full">
                  Entrar
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Não possui conta?</p>
                <Link to="/register" className="text-dark font-semibold hover:text-medium">
                  Criar conta gratuita
                </Link>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};