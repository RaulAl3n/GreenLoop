import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Trash2, Wine, FileText, Package } from 'lucide-react';

// Importações e Mocks fictícios (ajustadas para o ambiente de arquivo único)
const Button = ({ children, className, type, size, onClick }) => <button type={type} onClick={onClick} className={`p-3 rounded-lg ${className}`}>{children}</button>;
const Label = ({ children, htmlFor, className }) => <label htmlFor={htmlFor} className={className}>{children}</label>;
const useToast = () => ({
  toast: ({ title, description, variant }) => console.log(`Toast: ${title} - ${description} (Variant: ${variant})`),
});

// Simulação de localStorage (mantida para a lógica de persistência no ambiente de execução)
const localStorage = {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
};

const Services = () => {
  const { toast } = useToast();
  const [quantities, setQuantities] = useState({
    plastic: 0,
    glass: 0,
    paper: 0,
    metal: 0,
  });

  const materials = [
    {
      id: 'plastic',
      name: 'Plástico',
      icon: Trash2,
      unit: 'kg',
      rate: 0.0015,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'glass',
      name: 'Vidro',
      icon: Wine,
      unit: 'kg',
      rate: 0.001,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'paper',
      name: 'Papel',
      icon: FileText,
      unit: 'kg',
      rate: 0.002,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'metal',
      name: 'Metal',
      icon: Package,
      unit: 'kg',
      rate: 0.003,
      color: 'from-gray-500 to-gray-600',
    },
  ];

  // Manipulador de mudança de quantidade
  const handleQuantityChange = (materialId, value) => {
    if (value === '') {
      setQuantities(prev => ({
        ...prev,
        [materialId]: '',
      }));
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantities(prev => ({
        ...prev,
        [materialId]: numValue,
      }));
    }
  };

  // Limpa o '0' quando o campo recebe foco
  const handleFocus = (materialId, currentValue) => {
    if (currentValue === 0) {
      setQuantities(prev => ({
        ...prev,
        [materialId]: '', // Define o estado como string vazia para limpar o input
      }));
    }
  };

  // Retorna o valor para 0 (número) se o campo for deixado vazio (string vazia)
  const handleBlur = (materialId, value) => {
    if (value === '') {
      setQuantities(prev => ({
        ...prev,
        [materialId]: 0, // Define o estado de volta para 0 (número)
      }));
    }
  };

  const calculateTotal = () => {
    return materials.reduce((total, material) => {
      return total + (quantities[material.id] * material.rate);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    
    if (total === 0) {
      toast({
        title: "Atenção",
        description: "Por favor, insira a quantidade de pelo menos um material reciclável.",
        variant: "destructive",
      });
      return;
    }

    const submission = {
      materials: quantities,
      totalCrypto: total,
      timestamp: new Date().toISOString(),
    };

    const savedSubmissions = JSON.parse(localStorage.getItem('greenloop_submissions') || '[]');
    savedSubmissions.push(submission);
    localStorage.setItem('greenloop_submissions', JSON.stringify(savedSubmissions));

    toast({
      title: "Cálculo Realizado! 🎉",
      description: `Você receberá aproximadamente ${total.toFixed(6)} BTC pelos seus recicláveis!`,
    });

    setQuantities({
      plastic: 0,
      glass: 0,
      paper: 0,
      metal: 0,
    });
  };

  // Estilos CSS para remover as flechas do input (Spinner) em navegadores diferentes.
  const inputStyle = `
    /* Chrome, Safari, Edge, Opera */
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `;

  return (
    <>
      {/* Estilos injetados para remover as flechas do input de número */}
      {/* Usando <style> dentro do JSX é uma técnica permitida no ambiente de arquivo único. */}
      <style dangerouslySetInnerHTML={{ __html: inputStyle }} />

      {/* Estrutura principal do componente */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-[#538536] mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Calcule quanto você pode ganhar em criptomoedas com seus materiais recicláveis
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-[#538536] p-3 rounded-full">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#538536]">
                  Calculadora de Ganhos
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {materials.map((material) => (
                  <div key={material.id} className="space-y-2">
                    <Label htmlFor={material.id} className="flex items-center space-x-2 text-lg font-medium text-gray-700">
                      <div className={`bg-gradient-to-r ${material.color} p-2 rounded-lg`}>
                        <material.icon className="w-5 h-5 text-white" />
                      </div>
                      <span>{material.name} ({material.unit})</span>
                    </Label>
                    <div className="relative">
                      
                      <input
                        id={material.id}
                        type="number"
                        min="0"
                        step="0.1"
                        value={quantities[material.id]}
                        onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                        onFocus={() => handleFocus(material.id, quantities[material.id])}
                        onBlur={(e) => handleBlur(material.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors text-lg"
                        placeholder="0.0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                        {material.unit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Taxa: {material.rate} BTC por {material.unit}
                    </p>
                  </div>
                ))}

                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="bg-gradient-to-r from-[#538536] to-[#6ba84a] p-6 rounded-xl text-white mb-6">
                    <div className="text-sm font-medium mb-2">Total Estimado</div>
                    <div className="text-4xl font-bold">
                      {calculateTotal().toFixed(6)} BTC
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-green text-white hover:opacity-90 transition-opacity text-lg"
                  >
                    Calcular Ganhos
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Coluna de Informações (mantida) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-6">
                  Como Funciona
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#538536] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Insira as Quantidades</h4>
                      <p className="text-gray-600">Digite quanto de cada material você tem para reciclar.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#538536] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Calcule Seus Ganhos</h4>
                      <p className="text-gray-600">Veja instantaneamente quanto você receberá em BTC.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#538536] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Envie Seus Materiais</h4>
                      <p className="text-gray-600">Entre em contato conosco para agendar a coleta.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#538536] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Receba Suas Criptomoedas</h4>
                      <p className="text-gray-600">Após verificação, receba o pagamento direto na sua carteira.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-4">
                  Materiais Aceitos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <div key={material.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className={`bg-gradient-to-r ${material.color} p-3 rounded-lg inline-block mb-2`}>
                        <material.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-gray-800">{material.name}</div>
                      <div className="text-sm text-gray-600">{material.rate} BTC/{material.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

// Exportar o componente principal da aplicação
const App = () => {
    // Definindo o componente App principal que renderiza Services
    return <Services />;
}

export default App;