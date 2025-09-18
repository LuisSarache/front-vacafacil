// Importações necessárias
import { Link } from 'react-router-dom'; // Para navegação entre páginas
import { motion } from 'framer-motion'; // Para animações suaves
import { Shield, Zap, Users, Calendar, Activity, FileText } from 'lucide-react'; // Ícones vetoriais
import { Button } from '../components/Button'; // Botão customizado do projeto

// Página inicial (Home)
export const Home = () => {
  // Lista de recursos/funcionalidades que serão exibidos na seção de "features"
  const features = [
    {
      icon: Calendar,
      title: 'Agenda Dinâmica',
      description: 'Visualização de horários disponíveis com marcação automática e lembretes por e-mail'
    },
    {
      icon: Shield,
      title: 'Privacidade Garantida',
      description: 'Autenticação segura via JWT e proteção total dos dados sensíveis dos pacientes'
    },
    {
      icon: Activity,
      title: 'Análise Inteligente',
      description: 'Machine Learning para identificar padrões emocionais e agrupar perfis de risco'
    },
    {
      icon: Users,
      title: 'Impacto Social',
      description: 'Voltado para projetos voluntários, universidades e ONGs que oferecem apoio psicológico'
    },
    {
      icon: FileText,
      title: 'Histórico Estruturado',
      description: 'Registro organizado de sessões com temas, recomendações e evolução do paciente'
    },
    {
      icon: Zap,
      title: 'Interface Acolhedora',
      description: 'Design responsivo e acessível, pensado para conforto emocional dos usuários'
    }
  ];

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex items-center justify-center text-center py-20">
        <div>
          {/* Animação de entrada do framer-motion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} // Início invisível + deslocado
            animate={{ opacity: 1, y: 0 }}   // Anima até visível + posição normal
            transition={{ duration: 0.8 }}
          >
            {/* Logo centralizada */}
            <div className="w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl overflow-hidden bg-black/85">
              <img src="/logoblu.png" alt="BluRosiere" className="w-full h-full object-cover" />
            </div>
            
            {/* Nome do sistema */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              BluRosiere
            </h1>
            
            {/* Subtítulo */}
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">
            Atendimento Psicológico
            </h2>
            
            {/* Descrição principal */}
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema online voltado para facilitar o agendamento e a organização de atendimentos psicológicos gratuitos. Criado para universidades, ONGs e iniciativas sociais que incentivam o cuidado com a saúde mental.
            </p>
            
            {/* Botões de ação (CTA) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Botão para criar conta */}
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-white/90">
                  Começe Já!
                </Button>
              </Link>

              {/* Botão para rolar até os recursos */}
              <a href="#features" onClick={(e) => {
                e.preventDefault();
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto ">
                  Conhecer Recursos
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="min-h-screen flex items-center py-20">
        <div className="w-full">
          {/* Título da seção */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} // Só anima quando o usuário vê no scroll
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tecnologia a Serviço do Cuidado
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Ferramentas inteligentes para organizar, acompanhar e potencializar atendimentos voluntários
              </p>
            </motion.div>
          </div>

          {/* Grid com os recursos (features) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }} // Cada card aparece ao entrar na tela
                transition={{ delay: index * 0.1, duration: 0.6 }} // Delay incremental
                viewport={{ once: true }}
                className="text-center"
              >
                {/* Ícone dentro de um card arredondado */}
                <div className="w-20 h-20 bg-gradient-to-br from-light to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                {/* Título e descrição do recurso */}
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA (CALL TO ACTION) SECTION ================= */}
      <section className="min-h-screen flex items-center py-20">
        <div className="w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} // Aparece com scroll
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Faça Parte desta Transformação Social
            </h2>
            <p className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
              Una tecnologia e responsabilidade social. Ajude a democratizar o acesso 
              à saúde mental através de uma plataforma pensada para o bem-estar coletivo.
            </p>
            {/* Botão para criar conta */}
            <Link to="/register">
              <Button size="lg" className="text-xl px-12 py-5 rounded-2xl font-semibold">
                Criar Conta Gratuita
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
