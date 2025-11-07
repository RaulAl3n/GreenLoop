
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Nossa Missão',
      description: 'Conectar sustentabilidade e tecnologia blockchain para criar um futuro mais verde e próspero para todos.',
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Construir uma comunidade global de pessoas comprometidas com a reciclagem e sustentabilidade.',
    },
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Usar tecnologia de ponta para tornar a reciclagem mais acessível, transparente e recompensadora.',
    },
    {
      icon: Heart,
      title: 'Impacto',
      description: 'Criar impacto positivo mensurável no meio ambiente enquanto recompensamos nossos usuários.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sobre Nós - GreenLoop</title>
        <meta name="description" content="Conheça a GreenLoop e nossa missão de transformar reciclagem em recompensas cripto. Sustentabilidade encontra blockchain." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-[#538536] mb-6">
              Sobre a GreenLoop
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Somos pioneiros em unir sustentabilidade e tecnologia blockchain, criando um ecossistema onde reciclar se torna uma experiência recompensadora e transparente.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img alt="Equipe GreenLoop trabalhando em sustentabilidade" className="rounded-2xl shadow-2xl w-full" src="https://images.unsplash.com/photo-1634715022648-13d43a4e9fe8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-[#538536] mb-6">
                Nossa História
              </h2>
              <p className="text-gray-700 mb-4">
                A GreenLoop nasceu da visão de tornar a reciclagem mais acessível e recompensadora. Percebemos que muitas pessoas queriam contribuir para um planeta mais limpo, mas faltavam incentivos tangíveis.
              </p>
              <p className="text-gray-700 mb-4">
                Combinando blockchain e sustentabilidade, criamos uma plataforma onde cada material reciclado é convertido em valor real através de criptomoedas, garantindo transparência total em cada transação.
              </p>
              <p className="text-gray-700">
                Hoje, somos uma comunidade crescente de pessoas comprometidas em fazer a diferença, uma garrafa, uma lata, um papel de cada vez.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-[#538536] to-[#6ba84a] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#538536] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-green text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Nosso Compromisso
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-12">
              Estamos comprometidos em criar um futuro onde sustentabilidade e prosperidade caminham juntas. Cada material reciclado através da GreenLoop contribui para um planeta mais limpo e um futuro mais verde.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-green-100">Transparente</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-green-100">Disponível</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-green-100">Impacto</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
