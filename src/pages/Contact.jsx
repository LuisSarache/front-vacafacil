import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import toast from "react-hot-toast";

export const Contact = () => {
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

      toast.success("Mensagem preparada para envio!");
      setFormData({ name: '', email: '', message: '' }); // limpa o formulário
    } catch (error) {
      toast.error("Ocorreu um erro ao enviar a mensagem.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4">
      <section className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">
          Fale Conosco
        </h1>
        <p className="text-medium max-w-2xl mx-auto px-4 text-sm sm:text-base">
          Entre em contato para saber mais sobre o VacaFácil, tirar dúvidas sobre nossa plataforma ou solicitar suporte. Nossa equipe terá prazer em ajudá-lo!
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Formulário */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-medium/20">
          <h2 className="text-lg sm:text-xl font-semibold text-dark mb-4">Envie sua mensagem</h2>
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
              <label className="text-dark mb-1 text-sm font-medium">Mensagem</label>
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

          
        </div>

        {/* Informações de Contato */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-medium/20 space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-dark mb-4">Outros canais</h2>
          <div className="space-y-3 sm:space-y-4 text-medium">
            <p className="flex items-center gap-2 text-sm sm:text-base break-all sm:break-normal">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" /> 
              <span>contato@vacafacil.com</span>
            </p>
            <p className="flex items-center gap-2 text-sm sm:text-base">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" /> 
              <span>(35) 99999-9999</span>
            </p>
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" /> 
              <span>Senac, Rua Vicente Simões - Pouso Alegre/MG</span>
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">Siga-nos</h3>
            <div className="flex gap-3 sm:gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-accent hover:scale-110 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-accent hover:scale-110 transition" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-accent hover:scale-110 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
