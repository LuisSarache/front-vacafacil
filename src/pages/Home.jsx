import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Droplets, DollarSign, AlertTriangle, BarChart3, Users, Calendar, FileText } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import vacasol from '../assets/vacasol.webp'

export const Home = () => {
  const beneficios = [
    {
      icon: Heart,
      title: 'Fácil de Usar',
      description: 'Interface intuitiva pensada para produtores rurais de todos os níveis de experiência'
    },
    {
      icon: Droplets,
      title: 'Dados em Tempo Real',
      description: 'Acompanhe informações atualizadas sobre sua fazenda a qualquer momento'
    },
    {
      icon: DollarSign,
      title: 'Aumento da Lucratividade',
      description: 'Otimize custos e maximize lucros com análises inteligentes'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Automáticos',
      description: 'Gere relatórios profissionais sem complicação para tomada de decisões'
    },
    {
      icon: Users,
      title: 'Acesso Multiplataforma',
      description: 'Use no computador, tablet ou celular - funciona em qualquer dispositivo'
    },
    {
      icon: AlertTriangle,
      title: 'Alertas Inteligentes',
      description: 'Nunca mais esqueça datas importantes com notificações automáticas'
    }
  ];

  const comoFunciona = [
    {
      numero: '1',
      titulo: 'Cadastre sua Fazenda',
      descricao: 'Registre informações básicas sobre sua propriedade e rebanho'
    },
    {
      numero: '2',
      titulo: 'Registre os Dados',
      descricao: 'Insira informações diárias de produção, custos e eventos'
    },
    {
      numero: '3',
      titulo: 'Acompanhe Resultados',
      descricao: 'Visualize relatórios e tome decisões baseadas em dados reais'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center text-center px-4 py-12 sm:py-20">
        <motion.div 
          className="absolute inset-0 z-0"
  initial={{ scale: 1.1, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1.5, ease: "easeOut" }}
>
  <img src={vacasol} alt="Vaca no campo" className="w-full h-full object-cover object-center" />
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
</motion.div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 sm:mb-6">
          VacaFácil
        </h1>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white/90 drop-shadow-md mb-6">
          Tecnologia Simples para o Campo
        </h2>

            <p className="text-lg sm:text-xl text-white/80 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Desenvolvemos uma plataforma digital que transforma a gestão de fazendas leiteiras,
              tornando o controle mais fácil, eficiente e lucrativo para produtores rurais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Começar Agora
                </Button>
              </Link>
              <a href="#como-funciona" onClick={(e) => {
                e.preventDefault();
                document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' });
              }} className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Como Funciona
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-accent mb-2">500+</h3>
              <p className="text-medium text-sm sm:text-base">Fazendas Ativas</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-accent mb-2">15k+</h3>
              <p className="text-medium text-sm sm:text-base">Vacas Monitoradas</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-accent mb-2">98%</h3>
              <p className="text-medium text-sm sm:text-base">Satisfação</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-accent mb-2">24/7</h3>
              <p className="text-medium text-sm sm:text-base">Suporte</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4 sm:mb-6">
              Como Funciona
            </h2>
            <p className="text-lg sm:text-xl text-accent max-w-3xl mx-auto px-4">
              Em apenas 3 passos simples, você transforma a gestão da sua fazenda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {comoFunciona.map((passo, index) => (
              <div key={index}>
                <Card className="text-center h-full hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold shadow-lg">
                    {passo.numero}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-dark mb-3 sm:mb-4">{passo.titulo}</h3>
                  <p className="text-medium leading-relaxed text-sm sm:text-base">{passo.descricao}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-12 sm:py-20 px-4 bg-gradient-to-b from-transparent to-accent/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4 sm:mb-6">
              Por que Escolher o VacaFácil?
            </h2>
            <p className="text-lg sm:text-xl text-medium max-w-3xl mx-auto px-4">
              Desenvolvido especialmente para produtores rurais que buscam modernizar sua gestão
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index}>
                <Card className="text-center h-full group hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-medium to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <beneficio.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-dark mb-3 sm:mb-4">{beneficio.title}</h3>
                  <p className="text-medium leading-relaxed text-sm sm:text-base">{beneficio.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-6 sm:mb-8">
              Pronto para Modernizar sua Fazenda?
            </h2>
            <p className="text-lg sm:text-xl text-medium mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Milhares de produtores já descobriram como a tecnologia pode simplificar
              a gestão rural. Experimente gratuitamente e comprove os resultados.
            </p>
            <Link to="/register" className="inline-block">
              <Button size="lg" className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow duration-300">
                Começar Gratuitamente
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
