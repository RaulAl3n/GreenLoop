
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#538536] text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white p-2 rounded-full">
                <Leaf className="w-5 h-5 text-[#538536]" />
              </div>
              <span className="text-xl font-bold">GreenLoop</span>
            </div>
            <p className="text-sm text-green-100">
              Transformando reciclagem em recompensas cripto. Juntos por um planeta mais sustentável.
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Links Rápidos</span>
            <div className="space-y-2">
              <Link to="/" className="block text-green-100 hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="block text-green-100 hover:text-white transition-colors">
                Sobre nós
              </Link>
              <Link to="/servicos" className="block text-green-100 hover:text-white transition-colors">
                Serviços
              </Link>
              <Link to="/contato" className="block text-green-100 hover:text-white transition-colors">
                Contato
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contato</span>
            <div className="space-y-3 text-sm text-green-100">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contato@greenloop.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Sobre o Projeto</span>
            <p className="text-sm text-green-100">
              Aceitamos materiais recicláveis e recompensamos você com criptomoedas. Transparência total em cada transação.
            </p>
          </div>
        </div>

        <div className="border-t border-green-600 mt-8 pt-8 text-center text-sm text-green-100">
          <p>&copy; 2025 GreenLoop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
