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
    <div className="min-h-[calc(100vh-80px)] bg-white">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:pr-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-dark leading-tight">
                Bem-vindo ao <span className="text-accent">VacaFácil</span>
              </h1>
              <p className="text-lg text-medium leading-relaxed">
                A plataforma completa para gestão da sua fazenda de gado leiteiro.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              {[
                "Controle de produção de leite",
                "Monitoramento de saúde animal", 
                "Relatórios e análises detalhadas"
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Login Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="w-full max-w-md p-8 bg-transparent shadow-none border-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-2">Entrar</h2>
                <p className="text-medium">Acesse sua conta</p>
              </motion.div>
              
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
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
              </motion.form>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-6 text-center space-y-2"
              >
                <p className="text-medium">Não possui conta?</p>
                <Link to="/register" className="text-accent font-bold hover:text-dark transition-colors">
                  Criar Conta
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
