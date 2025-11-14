import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { ToastManager } from "../components/ToastManager";
import { useTranslation } from "../utils/i18n";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Clock, Users } from "lucide-react";
import vargem from '../assets/vargem.png';
import sozinha from '../assets/sozinha.png';

export const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Colocar api do backend qnd tiver pronto

      ToastManager.success("Mensagem preparada para envio!");
      setFormData({ name: '', email: '', message: '' }); // limpa o formulário
    } catch {
      ToastManager.error("Ocorreu um erro ao enviar a mensagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4">
      {/* Hero Section com Imagem */}
      <section className="relative mb-12 sm:mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
            <motion.img 
              src={vargem} 
              alt="Paisagem da fazenda" 
              className="w-full h-full object-cover object-bottom"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-center text-white px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  Fale Conosco
                </h1>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto drop-shadow-md">
                  Entre em contato para saber mais sobre o VacaFácil, tirar dúvidas sobre nossa plataforma ou solicitar suporte.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Formulário */}
          <div>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-dark">Envie sua mensagem</h2>
              </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {/* Campo de mensagem autoajustável */}
            <div className="flex flex-col">
              <label className="text-dark mb-1 text-sm font-medium">{t('Mensagem')}</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Digite sua mensagem aqui..."
                className="w-full p-2 sm:p-3 rounded-lg bg-white border border-medium/30 text-dark placeholder-medium/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-sm sm:text-base"
                rows={3}
                onInput={(e) => {
                  e.target.style.height = "auto"; // reseta altura
                  e.target.style.height = e.target.scrollHeight + "px"; // ajusta à quantidade de linhas
                }}
                required
              />
            </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 text-sm sm:text-base"
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </form>

          
            </Card>
          </div>

          {/* Informações de Contato */}
          <div>
            <div className="space-y-6 sm:space-y-8">
              <Card className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-dark">Contato</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-accent/5 rounded-xl">
                    <Mail className="w-5 h-5 text-accent mr-4" /> 
                    <div>
                      <p className="font-medium text-dark">Email</p>
                      <p className="text-medium text-sm">contato@vacafacil.com</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-accent/5 rounded-xl">
                    <Phone className="w-5 h-5 text-accent mr-4" /> 
                    <div>
                      <p className="font-medium text-dark">Telefone</p>
                      <p className="text-medium text-sm">(35) 99999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-accent/5 rounded-xl">
                    <MapPin className="w-5 h-5 text-accent mr-4 mt-0.5" /> 
                    <div>
                      <p className="font-medium text-dark">Endereço</p>
                      <p className="text-medium text-sm">Senac, Rua Vicente Simões - Pouso Alegre/MG</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark">Redes Sociais</h3>
                </div>
                <div className="flex gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Seção Final com Imagem */}
        <motion.section 
          className="mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden">
            <img 
              src={sozinha} 
              alt="Vaca no campo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-lg">
                  Estamos Aqui Para Ajudar
                </h3>
                <p className="text-lg drop-shadow-md">
                  Nossa equipe está pronta para apoiar o crescimento da sua fazenda
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
