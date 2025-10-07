//! importação das bibliotecas e componentes
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ToastManager } from "../components/ToastManager";

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
    if (formData.password !== formData.confirmPassword) {
      ToastManager.error("Senhas não coincidem");
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
    <div className="min-h-[calc(100vh-80px)] bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:pr-8 lg:sticky lg:top-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-dark leading-tight">
                Junte-se ao <span className="text-accent">VacaFácil</span>
              </h1>
              <p className="text-lg text-medium leading-relaxed">
                Cadastre-se gratuitamente e transforme a gestão da sua fazenda.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-dark">O que você terá acesso:</h3>
              <div className="space-y-3">
                {[
                  "Dashboard completo com métricas",
                  "Controle individual de cada animal",
                  "Histórico de produção e saúde",
                  "Relatórios personalizados"
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
              </div>
            </motion.div>
          </motion.div>

          {/* Register Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="w-full max-w-lg p-8 bg-transparent shadow-none border-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-dark mb-2">
                  Criar Conta
                </h2>
                <p className="text-medium">Cadastre-se como Produtor de Leite</p>
              </motion.div>

              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  placeholder="seu@email.com"
                  required
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                
                <Input
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  placeholder="Digite seu telefone"
                  required
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <Button type="submit" loading={loading} className="w-full mt-6">
                  Criar Conta
                </Button>
              </motion.form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-6 text-center space-y-2"
              >
                <p className="text-medium">Já possui conta?</p>
                <Link to="/login" className="text-accent font-bold hover:text-dark transition-colors">
                  Faça login!
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
