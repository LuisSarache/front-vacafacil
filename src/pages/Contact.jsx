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
    <div className="py-12 max-w-5xl mx-auto px-4">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Fale Conosco
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Entre em contato para saber mais sobre o BluRosiere, apoiar nossa causa, tirar dúvidas ou fazer doações. Nossa equipe terá prazer em falar com você!
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Formulário */}
        <div className="bg-black/50 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Envie sua mensagem</h2>
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
              <label className="text-white/70 mb-1">Mensagem</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Digite sua mensagem aqui..."
                className="w-full p-3 rounded-lg bg-white/10  text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                rows={1}
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
                className="w-full mt-4"
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </form>

          
        </div>

        {/* Informações de Contato */}
        <div className="bg-black/50 p-6 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Outros canais</h2>
          <div className="space-y-4 text-white/80">
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" /> contato@blurosiere.org
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-accent" /> (35) 99999-9999
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" /> Senac, Rua Vicente Simões - Pouso Alegre/MG
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Siga-nos</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <Facebook className="w-6 h-6 text-accent hover:scale-110 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <Instagram className="w-6 h-6 text-accent hover:scale-110 transition" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="w-6 h-6 text-accent hover:scale-110 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
