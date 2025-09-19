import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Droplets, DollarSign, AlertTriangle, BarChart3, Users, Calendar, FileText } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

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
      <section className="min-h-screen flex items-center justify-center text-center py-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl overflow-hidden bg-black/85">
              <Heart className="w-16 h-16 text-accent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6">
              VacaFácil
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-medium text-medium mb-6">
              Tecnologia Simples para o Campo
            </h2>
            
            <p className="text-xl text-medium mb-8 max-w-3xl mx-auto leading-relaxed">
              Desenvolvemos uma plataforma digital que transforma a gestão de fazendas leiteiras, 
              tornando o controle mais fácil, eficiente e lucrativo para produtores rurais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-white/90">
                  Começar Agora
                </Button>
              </Link>
              <a href="#como-funciona" onClick={(e) => {
                e.preventDefault();
                document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' });
              }}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Como Funciona
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Como Funciona
            </h2>
            <p className="text-xl text-medium max-w-3xl mx-auto">
              Em apenas 3 passos simples, você transforma a gestão da sua fazenda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {comoFunciona.map((passo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {passo.numero}
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-4">{passo.titulo}</h3>
                  <p className="text-medium leading-relaxed">{passo.descricao}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Por que Escolher o VacaFácil?
            </h2>
            <p className="text-xl text-medium max-w-3xl mx-auto">
              Desenvolvido especialmente para produtores rurais que buscam modernizar sua gestão
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-medium to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <beneficio.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-4">{beneficio.title}</h3>
                  <p className="text-medium leading-relaxed">{beneficio.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-8">
              Pronto para Modernizar sua Fazenda?
            </h2>
            <p className="text-xl text-medium mb-12 max-w-3xl mx-auto leading-relaxed">
              Milhares de produtores já descobriram como a tecnologia pode simplificar 
              a gestão rural. Experimente gratuitamente e comprove os resultados.
            </p>
            <Link to="/register">
              <Button size="lg" className="text-xl px-12 py-5 rounded-2xl font-semibold">
                Começar Gratuitamente
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
