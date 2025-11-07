
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const submission = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    const savedContacts = JSON.parse(localStorage.getItem('greenloop_contacts') || '[]');
    savedContacts.push(submission);
    localStorage.setItem('greenloop_contacts', JSON.stringify(savedContacts));

    toast({
      title: "Mensagem Enviada! 🎉",
      description: "Obrigado pelo contato! Responderemos em breve.",
    });

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@greenloop.com',
      link: 'mailto:contato@greenloop.com',
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '+55 (11) 9999-9999',
      link: 'tel:+5511999999999',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'São Paulo, Brasil',
      link: null,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contato - Fale Conosco | GreenLoop</title>
        <meta name="description" content="Entre em contato com a GreenLoop. Estamos prontos para responder suas dúvidas sobre reciclagem e criptomoedas." />
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
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Tem dúvidas ou sugestões? Estamos aqui para ajudar!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-3xl font-bold text-[#538536] mb-6">
                  Envie uma Mensagem
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nome *
                    </Label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email *
                    </Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Assunto
                    </Label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors"
                      placeholder="Sobre o que você quer falar?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      Mensagem *
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors resize-none"
                      placeholder="Escreva sua mensagem aqui..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-green text-white hover:opacity-90 transition-opacity"
                  >
                    Enviar Mensagem
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-6">
                  Informações de Contato
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-[#538536] to-[#6ba84a] p-3 rounded-lg flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 hover:text-[#538536] transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-4">
                  Horário de Atendimento
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Segunda - Sexta:</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sábado:</span>
                    <span>9:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Domingo:</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img alt="Mapa de localização GreenLoop em São Paulo" className="w-full h-64 object-cover" src="https://images.unsplash.com/photo-1693471019113-d2837cc9a2cc" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
