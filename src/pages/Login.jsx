import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ToastManager } from "../components/ToastManager";

import { validateEmail, validatePassword } from "../utils/validation";
import { Shield, BarChart3, Users } from "lucide-react";

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
      const response = await apiService.login(
        formData.email,
        formData.password
      );
      const { access_token: token } = response;
      
      apiService.setToken(token);
      const userData = await apiService.getCurrentUser();
      
      localStorage.setItem('user', JSON.stringify(userData));
      ToastManager.success("Login realizado com sucesso!");
      
      window.location.href = '/dashboard';
    } catch (error) {
      const errorMsg = error.message?.includes('401') || error.message?.includes('Unauthorized')
        ? "E-mail ou senha incorretos. Registre um novo usuário se necessário."
        : error.message || "Erro ao fazer login";
      ToastManager.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: BarChart3, text: "Acesse seu dashboard", delay: 0.6 },
    { icon: Users, text: "Gerencie seu rebanho", delay: 0.7 },
    { icon: Shield, text: "Visualize relatórios", delay: 0.8 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Welcome */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-dark/5 to-dark/10"
      >
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-dark mb-6">
              Bem-vindo de volta!
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Continue gerenciando sua fazenda com eficiência e praticidade.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-dark/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-dark" />
                </div>
                <span className="text-gray-700 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <motion.h2 
              className="text-3xl font-bold text-dark mb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              VacaFácil
            </motion.h2>
            <p className="text-gray-600">Entre na sua conta</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50">
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Input
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Input
                    label="Senha"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Sua senha"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" loading={loading} className="w-full">
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </motion.div>
              </form>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-6 text-center space-y-3"
              >
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-dark transition-colors duration-300 hover:underline block"
                >
                  Esqueceu sua senha?
                </Link>
                <div>
                  <p className="text-gray-600 mb-2">Não possui conta?</p>
                  <Link 
                    to="/register" 
                    className="text-dark font-semibold hover:text-medium transition-colors duration-300 hover:underline"
                  >
                    Criar conta gratuita
                  </Link>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
};