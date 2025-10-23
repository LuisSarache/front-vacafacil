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
import { Zap, Shield, BarChart3, HeadphonesIcon } from "lucide-react";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    location: "",
    phone: "",
    cpfCnpj: ""
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
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
    
    if (!validateRequired(formData.farmName)) {
      ToastManager.error("Nome da fazenda é obrigatório");
      return;
    }
    
    setLoading(true);
    try {
      const { user, token } = await mockApi.register(formData);
      await login(user, token);
      ToastManager.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      ToastManager.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Zap, text: "Cadastro rápido e gratuito", delay: 0.6 },
    { icon: BarChart3, text: "Gestão completa do rebanho", delay: 0.7 },
    { icon: Shield, text: "Relatórios automáticos", delay: 0.8 },
    { icon: HeadphonesIcon, text: "Suporte especializado", delay: 0.9 }
  ];

  const formFields = [
    [
      { name: "name", label: "Nome completo", placeholder: "Seu nome completo", required: true },
      { name: "cpfCnpj", label: "CPF ou CNPJ", placeholder: "000.000.000-00" }
    ],
    [
      { name: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", required: true, fullWidth: true }
    ],
    [
      { name: "farmName", label: "Nome da Fazenda", placeholder: "Nome da sua propriedade", required: true },
      { name: "location", label: "Localização", placeholder: "Cidade/Estado" }
    ],
    [
      { name: "phone", label: "Telefone", type: "tel", placeholder: "(11) 99999-9999", fullWidth: true }
    ],
    [
      { name: "password", label: "Senha", type: "password", placeholder: "Mínimo 6 caracteres", required: true },
      { name: "confirmPassword", label: "Confirme a senha", type: "password", placeholder: "Digite novamente", required: true }
    ]
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
              Bem-vindo ao VacaFácil!
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Junte-se a centenas de produtores que já modernizaram suas fazendas.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: benefit.delay }}
                className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-dark/10 rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-dark" />
                </div>
                <span className="text-gray-700 font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg"
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
            <p className="text-gray-600">Crie sua conta gratuita</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50">
              <form onSubmit={handleSubmit} className="space-y-5">
                {formFields.map((fieldGroup, groupIndex) => (
                  <motion.div
                    key={groupIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + (groupIndex * 0.1) }}
                    className={fieldGroup[0]?.fullWidth ? "w-full" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}
                  >
                    {fieldGroup.map((field, fieldIndex) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + (groupIndex * 0.1) + (fieldIndex * 0.05) }}
                        className={field.fullWidth ? "col-span-full" : ""}
                      >
                        <Input
                          label={field.label}
                          type={field.type || "text"}
                          value={formData[field.name]}
                          onChange={handleInputChange(field.name)}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" loading={loading} className="w-full">
                    {loading ? "Criando conta..." : "Criar Conta Gratuita"}
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-6 text-center"
              >
                <p className="text-gray-600 mb-2">Já possui conta?</p>
                <Link 
                  to="/login" 
                  className="text-dark font-semibold hover:text-medium transition-colors duration-300 hover:underline"
                >
                  Fazer login
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};