
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Recycle, Coins, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const features = [
    {
      icon: Recycle,
      title: 'Recicle com Facilidade',
      description: 'Envie seus materiais recicláveis e contribua para um planeta mais limpo.',
    },
    {
      icon: Coins,
      title: 'Ganhe Cripto',
      description: 'Receba pagamentos em criptomoedas por cada material reciclado.',
    },
    {
      icon: Shield,
      title: 'Transparência Total',
      description: 'Todas as transações são registradas de forma transparente e segura.',
    },
    {
      icon: TrendingUp,
      title: 'Impacto Mensurável',
      description: 'Acompanhe seu impacto ambiental e ganhos em tempo real.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>GreenLoop - Reciclagem que Recompensa em Cripto</title>
        <meta name="description" content="Transforme seus materiais recicláveis em criptomoedas. GreenLoop conecta sustentabilidade e tecnologia blockchain para um futuro mais verde." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#538536] mb-6 leading-tight">
                Recicle e Ganhe Cripto
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Transforme seus materiais recicláveis em recompensas digitais. Junte-se à revolução verde e sustentável com blockchain.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/servicos">
                  <Button size="lg" className="gradient-green text-white hover:opacity-90 transition-opacity">
                    Começar Agora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button size="lg" variant="outline" className="border-[#538536] text-[#538536] hover:bg-green-50">
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img alt="Pessoa reciclando materiais com tecnologia blockchain" className="rounded-2xl shadow-2xl w-full" src="https://images.unsplash.com/photo-1567516847971-81df16eefa90" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#538536] mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simples, transparente e recompensador
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#538536] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#538536] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-green">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img alt="Estatísticas de impacto ambiental e reciclagem" className="rounded-2xl shadow-2xl w-full" src="https://images.unsplash.com/photo-1686061593213-98dad7c599b9" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">
                Seu Impacto em Números
              </h2>
              <p className="text-xl mb-8 text-green-100">
                Acompanhe em tempo real quanto você está contribuindo para um planeta mais sustentável e quanto está ganhando.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-green-100">Usuários Ativos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">50 ton</div>
                  <div className="text-green-100">Recicladas</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-[#538536] mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão transformando reciclagem em recompensas digitais.
            </p>
            <Link to="/servicos">
              <Button size="lg" className="gradient-green text-white hover:opacity-90 transition-opacity">
                Calcular Meus Ganhos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
