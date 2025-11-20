import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ToastManager } from "../components/ToastManager";
import { validateEmail, validatePassword, validateRequired } from "../utils/validation";
import { Zap, Shield, BarChart3, HeadphonesIcon, ArrowRight, ArrowLeft, User, Building, Check } from "lucide-react";

export const Register = () => {
  const [step, setStep] = useState(1);
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

  const validateStep1 = () => {
    if (!validateRequired(formData.name)) {
      ToastManager.error("Nome é obrigatório");
      return false;
    }
    if (!validateEmail(formData.email)) {
      ToastManager.error("E-mail inválido");
      return false;
    }
    if (!validatePassword(formData.password)) {
      ToastManager.error("Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      ToastManager.error("Senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRequired(formData.farmName)) {
      ToastManager.error("Nome da fazenda é obrigatório");
      return;
    }
    
    setLoading(true);
    try {
      await apiService.register(formData);
      ToastManager.success("Conta criada com sucesso!");
      
      // Aguardar um pouco para o backend processar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fazer login após o registro
      try {
        const loginResponse = await apiService.login(formData.email, formData.password);
        const { access_token: token } = loginResponse;
        
        apiService.setToken(token);
        const userData = await apiService.getCurrentUser();
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        window.location.href = '/escolher-plano';
      } catch (loginError) {
        ToastManager.info("Faça login com suas credenciais");
        navigate("/login", { replace: true });
      }
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

  const step1Fields = [
    { name: "name", label: "Nome completo", placeholder: "Seu nome completo", required: true, icon: User },
    { name: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", required: true },
    { name: "password", label: "Senha", type: "password", placeholder: "Mínimo 6 caracteres", required: true },
    { name: "confirmPassword", label: "Confirme a senha", type: "password", placeholder: "Digite novamente", required: true }
  ];

  const step2Fields = [
    { name: "farmName", label: "Nome da Fazenda", placeholder: "Nome da sua propriedade", required: true, icon: Building },
    { name: "location", label: "Localização", placeholder: "Cidade/Estado" },
    { name: "phone", label: "Telefone", type: "tel", placeholder: "(11) 99999-9999" },
    { name: "cpfCnpj", label: "CPF ou CNPJ", placeholder: "000.000.000-00" }
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
            <p className="text-gray-600 mb-6">Crie sua conta gratuita</p>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step === 1 ? 'bg-dark text-white' : 
                  step > 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > 1 ? <Check size={20} /> : '1'}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  step === 1 ? 'text-dark' : 'text-gray-500'
                }`}>Dados Pessoais</span>
              </button>
              
              <div className={`h-0.5 w-12 transition-all ${
                step === 2 ? 'bg-dark' : 'bg-gray-300'
              }`} />
              
              <button
                onClick={() => step > 1 && setStep(2)}
                className="flex items-center gap-2 group cursor-pointer"
                disabled={step < 2}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step === 2 ? 'bg-dark text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  step === 2 ? 'text-dark' : 'text-gray-500'
                }`}>Dados da Fazenda</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-8 bg-white shadow-2xl border-0">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dados Pessoais</h3>
                      <p className="text-gray-600">Crie suas credenciais de acesso</p>
                    </div>

                    {step1Fields.map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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

                    <Button type="submit" size="lg" className="w-full mt-8">
                      Continuar <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dados da Fazenda</h3>
                      <p className="text-gray-600">Informações sobre sua propriedade</p>
                    </div>

                    {step2Fields.map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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

                    <div className="flex gap-3 mt-8">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setStep(1)}
                        size="lg"
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2" size={18} /> Voltar
                      </Button>
                      <Button type="submit" loading={loading} size="lg" className="flex-1">
                        {loading ? "Criando..." : "Criar Conta"}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Já possui conta?</p>
                <Link 
                  to="/login" 
                  className="text-dark font-semibold hover:text-medium transition-colors duration-300 hover:underline"
                >
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