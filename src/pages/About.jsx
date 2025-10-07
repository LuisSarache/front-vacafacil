import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Heart, Target, Award, Users, Droplets, BarChart3, Calendar, FileText, DollarSign } from 'lucide-react';
import amanhecer from '../assets/amanhecer.png';
import mamae from '../assets/mamae.png';
import tarde from '../assets/tarde.png';

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
    <div className="py-8 sm:py-12 space-y-12 sm:space-y-16 px-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Sobre o <span className="text-accent">VacaFácil</span>
          </h1>
          <p className="text-lg sm:text-xl text-medium leading-relaxed">
            O VacaFácil é uma plataforma digital desenvolvida especialmente para modernizar 
            a gestão de fazendas leiteiras, oferecendo tecnologia simples e eficiente para o campo.
          </p>
        </motion.div>
      </section>

      {/* Missão e Visão */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8 h-full hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-dark">Nossa Missão</h2>
              </div>
              <p className="text-medium leading-relaxed">
                Democratizar o acesso à tecnologia no campo, oferecendo ferramentas simples 
                que ajudem produtores rurais a otimizar sua gestão e aumentar a lucratividade.
              </p>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8 h-full hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-dark">Nossa Visão</h2>
              </div>
              <p className="text-medium leading-relaxed">
                Ser a principal plataforma de gestão para fazendas leiteiras no Brasil, 
                reconhecida pela simplicidade e eficiência de nossas soluções.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Problemas e Soluções */}
      <section className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">O que buscamos resolver</h2>
          <p className="text-lg text-medium max-w-3xl mx-auto">Identificamos os principais desafios e criamos soluções eficazes</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8 h-full border-l-4 border-red-500">
              <h3 className="text-xl sm:text-2xl font-semibold text-dark mb-6 flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                Problemas
              </h3>
              <ul className="space-y-3">
                {problems.map((problem, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start text-medium"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {problem}
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8 h-full border-l-4 border-green-500">
              <h3 className="text-xl sm:text-2xl font-semibold text-dark mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                Nossas Soluções
              </h3>
              <ul className="space-y-3">
                {solutions.map((solution, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start text-medium"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {solution}
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Seção com Imagem */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img 
              src={amanhecer} 
              alt="Amanhecer na fazenda" 
              className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark">
              Tecnologia que Respeita a Tradição
            </h2>
            <p className="text-lg text-medium leading-relaxed">
              Desenvolvemos o VacaFácil pensando no dia a dia do produtor rural. 
              Nossa tecnologia se adapta à rotina da fazenda, não o contrário.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
                <span className="text-medium">Interface simples e intuitiva</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
                <span className="text-medium">Funciona offline</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="features" className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">Funcionalidades</h2>
          <p className="text-lg text-medium max-w-3xl mx-auto">Tudo que você precisa para gerenciar sua fazenda</p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index}>
              <Card className="p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-dark mb-3">{feature.title}</h3>
                <p className="text-medium leading-relaxed">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Seção com Duas Imagens */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src={mamae} 
              alt="Cuidado com o gado" 
              className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold mb-2">Cuidado Especializado</h3>
              <p className="text-sm">Monitoramento completo da saúde do rebanho</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src={tarde} 
              alt="Fazenda no final do dia" 
              className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold mb-2">Resultados Visíveis</h3>
              <p className="text-sm">Aumento da produtividade e lucratividade</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">Nossos Valores</h2>
          <p className="text-lg text-medium max-w-3xl mx-auto">Os princípios que guiam nosso trabalho</p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((value, index) => (
            <div key={index}>
              <Card className="p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center h-full">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-dark mb-3">{value.title}</h3>
                <p className="text-medium leading-relaxed">{value.description}</p>
              </Card>
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
