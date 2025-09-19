// Importações necessárias
import { Link } from 'react-router-dom'; 
import { Button } from '../components/Button';
import { Heart, Target, Award, Users, Droplets, BarChart3, Calendar, FileText, DollarSign } from 'lucide-react';

export const About = () => {
  const values = [
    { icon: <Heart className="w-6 h-6 text-accent" />, title: "Simplicidade", description: "Desenvolvemos soluções fáceis de usar para produtores de todos os níveis." },
    { icon: <Target className="w-6 h-6 text-accent" />, title: "Eficiência", description: "Focamos em otimizar processos e aumentar a produtividade das fazendas." },
    { icon: <Award className="w-6 h-6 text-accent" />, title: "Qualidade", description: "Entregamos tecnologia confiável que realmente faz a diferença no campo." },
    { icon: <Users className="w-6 h-6 text-accent" />, title: "Parceria", description: "Caminhamos junto com o produtor rural em sua jornada de crescimento." },
  ];

  const features = [
    { icon: <Droplets className="w-6 h-6 text-accent" />, title: "Controle de Produção", description: "Registre e acompanhe a produção de leite de cada vaca diariamente." },
    { icon: <Heart className="w-6 h-6 text-accent" />, title: "Gestão do Rebanho", description: "Mantenha histórico completo de saúde e reprodução do gado." },
    { icon: <DollarSign className="w-6 h-6 text-accent" />, title: "Controle Financeiro", description: "Gerencie custos, receitas e analise a lucratividade da fazenda." },
    { icon: <Calendar className="w-6 h-6 text-accent" />, title: "Alertas Automáticos", description: "Receba lembretes de vacinação, inseminação e outros eventos importantes." },
    { icon: <FileText className="w-6 h-6 text-accent" />, title: "Relatórios Detalhados", description: "Gere relatórios profissionais para análise e tomada de decisões." },
    { icon: <BarChart3 className="w-6 h-6 text-accent" />, title: "Análises Inteligentes", description: "Visualize gráficos e indicadores para otimizar sua produção." },
  ];

  const problems = [
    "Dificuldade em controlar a produção e custos da fazenda manualmente.",
    "Falta de organização nos dados do rebanho e histórico de saúde.",
    "Perda de informações importantes sobre vacinação e reprodução.",
    "Dificuldade em analisar a lucratividade e tomar decisões estratégicas.",
  ];

  const solutions = [
    "Sistema digital completo para gestão de fazendas leiteiras.",
    "Controle automatizado de produção, custos e alertas importantes.",
    "Interface simples e intuitiva, pensada para o produtor rural.",
    "Relatórios e análises que ajudam na tomada de decisões estratégicas.",
  ];

  return (
    <div className="py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-dark">
          Sobre o <span className="text-accent">VacaFácil</span>
        </h1>
        <p className="text-lg text-medium">
          O VacaFácil é uma plataforma digital desenvolvida especialmente para modernizar 
          a gestão de fazendas leiteiras, oferecendo tecnologia simples e eficiente para o campo.
        </p>
      </section>

      {/* Missão e Visão */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="p-6 rounded-2xl bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-dark mb-4">Nossa Missão</h2>
          <p className="text-medium">
            Democratizar o acesso à tecnologia no campo, oferecendo ferramentas simples 
            que ajudem produtores rurais a otimizar sua gestão e aumentar a lucratividade.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-dark mb-4">Nossa Visão</h2>
          <p className="text-medium">
            Ser a principal plataforma de gestão para fazendas leiteiras no Brasil, 
            reconhecida pela simplicidade e eficiência de nossas soluções.
          </p>
        </div>
      </section>

      {/* Problemas e Soluções */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-dark mb-12">O que buscamos resolver</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-dark mb-4">Problemas</h3>
            <ul className="space-y-2 list-disc list-inside text-medium">
              {problems.map((problem, index) => (
                <li key={index}>{problem}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-dark mb-4">Nossas Soluções</h3>
            <ul className="space-y-2 list-disc list-inside text-medium">
              {solutions.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="features" className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-dark mb-12">Funcionalidades</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-dark mb-2">{feature.title}</h3>
              <p className="text-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-dark mb-12">Nossos Valores</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition text-center">
              <div className="mb-4 flex justify-center">{value.icon}</div>
              <h3 className="text-lg font-semibold text-dark mb-2">{value.title}</h3>
              <p className="text-medium">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA com Links */}
      <section className="py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6">
          Quer saber mais?
        </h2>
        <p className="text-medium mb-8">
          Explore nossas funcionalidades ou entre em contato para conhecer melhor o VacaFácil.
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
