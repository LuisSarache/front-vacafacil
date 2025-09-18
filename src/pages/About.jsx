// Importações necessárias
import { Link } from 'react-router-dom'; 
import { Button } from '../components/Button';
import { Heart, Target, Award, Users, Shield, Zap, Calendar, FileText, Activity } from 'lucide-react';

export const About = () => {
  const values = [
    { icon: <Heart className="w-6 h-6 text-accent" />, title: "Empatia", description: "Cada recurso é desenvolvido para apoiar e valorizar o trabalho social." },
    { icon: <Target className="w-6 h-6 text-accent" />, title: "Objetividade", description: "Priorizamos clareza e praticidade para facilitar o dia a dia das ONGs." },
    { icon: <Award className="w-6 h-6 text-accent" />, title: "Excelência", description: "Buscamos sempre entregar soluções de impacto positivo para a comunidade." },
    { icon: <Users className="w-6 h-6 text-accent" />, title: "Colaboração", description: "Acreditamos na força do trabalho coletivo para gerar transformação social." },
  ];

  const features = [
    { icon: <Users className="w-6 h-6 text-accent" />, title: "De Casa para Casa", description: "Faça e seja atendido com consultas do conforto de sua casa." },
    { icon: <Shield className="w-6 h-6 text-accent" />, title: "Segurança", description: "Garantimos a proteção dos dados e informações das organizações." },
    { icon: <Zap className="w-6 h-6 text-accent" />, title: "Agilidade", description: "Interface simples que facilita a gestão de atividades e projetos." },
    { icon: <Calendar className="w-6 h-6 text-accent" />, title: "Agenda de Atividades", description: "Planeje eventos, campanhas e encontros com facilidade." },
    { icon: <FileText className="w-6 h-6 text-accent" />, title: "Relatórios", description: "Gere relatórios claros para acompanhamento das ações sociais." },
    { icon: <Activity className="w-6 h-6 text-accent" />, title: "Impacto", description: "Monitore e apresente os resultados alcançados pelas suas iniciativas." },
  ];

  const problems = [
    "Falta de ferramentas acessíveis para organizar ações sociais.",
    "Dificuldade em gerenciar recursos e registrar atividades.",
    "Pouca integração entre organizações, comunidades e parceiros.",
    "Necessidade de mais transparência e comunicação eficiente.",
  ];

  const solutions = [
    "Plataforma digital que conecta ONGs, voluntários e comunidade.",
    "Sistema de agendas e relatórios automatizados.",
    "Interface intuitiva para qualquer perfil de usuário.",
    "Foco na transparência e no fortalecimento do impacto social.",
  ];

  return (
    <div className="py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Sobre o <span className="text-accent">BluRosiere</span>
        </h1>
        <p className="text-lg text-white/70">
          O BluRosiere é um sistema inovador voltado para apoiar ONGs e iniciativas voluntárias, 
          oferecendo ferramentas práticas para organização, gestão e impacto social.
        </p>
      </section>

      {/* Missão e Visão */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="p-6 rounded-2xl bg-light shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Nossa Missão</h2>
          <p className="text-white/70">
            Fortalecer ONGs e grupos de voluntários através da tecnologia, 
            oferecendo soluções que facilitem a gestão e ampliem o alcance social.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-light shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Nossa Visão</h2>
          <p className="text-white/70">
            Ser referência em soluções digitais para o terceiro setor, reconhecida pelo impacto 
            positivo na vida de comunidades e voluntários.
          </p>
        </div>
      </section>

      {/* Problemas e Soluções */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-12">O que buscamos resolver</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-light rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Problemas</h3>
            <ul className="space-y-2 list-disc list-inside text-white/70">
              {problems.map((problem, index) => (
                <li key={index}>{problem}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-light rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Nossas Soluções</h3>
            <ul className="space-y-2 list-disc list-inside text-white/70">
              {solutions.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="features" className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-12">Funcionalidades</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-light rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-12">Nossos Valores</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="p-6 bg-light rounded-2xl shadow-sm hover:shadow-md transition text-center">
              <div className="mb-4 flex justify-center">{value.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-white/70">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA com Links */}
      <section className="py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Quer saber mais?
        </h2>
        <p className="text-white/70 mb-8">
          Explore nossas funcionalidades ou entre em contato para conhecer melhor o BluRosiere.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Ver Funcionalidades
          </Button>
          <Link to="/contact">
            <Button variant="secondary">Fale Conosco</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
