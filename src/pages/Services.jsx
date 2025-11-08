import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, Trash2, Wine, FileText, Package, User, Wallet, Calendar, Mail, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";


const Services = () => {
  const { toast } = useToast();
  const [quantities, setQuantities] = useState({
    plastic: 0,
    glass: 0,
    paper: 0,
    metal: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ novo estado de carregamento
  const [userData, setUserData] = useState({
    email: '',
    cpf: '',
    birthdate: '',
    wallet: '',
  });
  
  // NOVO ESTADO: Para rastrear qual input está focado.
  // Ele armazenará o ID do material que está sendo editado ou null.
  const [focusedInput, setFocusedInput] = useState(null); 

  const materials = [
    { id: 'plastic', name: 'Plástico', icon: Trash2, unit: 'kg', rate: 0.0015, color: 'from-blue-500 to-blue-600' },
    { id: 'glass', name: 'Vidro', icon: Wine, unit: 'kg', rate: 0.001, color: 'from-gray-500 to-gray-600' },
    { id: 'paper', name: 'Papel', icon: FileText, unit: 'kg', rate: 0.002, color: 'from-gray-500 to-gray-600' },
    { id: 'metal', name: 'Metal', icon: Package, unit: 'kg', rate: 0.003, color: 'from-gray-500 to-gray-600' },
  ];

  const handleQuantityChange = (materialId, value) => {
    // Permite que o campo fique vazio (string vazia) enquanto o usuário digita
    if (value === '') {
        setQuantities(prev => ({ ...prev, [materialId]: '' }));
        return;
    }
    const numValue = parseFloat(value) || 0;
    setQuantities(prev => ({ ...prev, [materialId]: numValue >= 0 ? numValue : 0 }));
  };

  const handleUserChange = (e) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateTotal = () => materials.reduce((total, material) => {
    // Garante que o cálculo use 0 se o valor no estado for string vazia
    const quantity = quantities[material.id] === '' ? 0 : quantities[material.id];
    return total + (quantity * material.rate);
  }, 0);

  const handleOpenDialog = (e) => {
    e.preventDefault();
    // Garante que todos os estados de input vazios sejam convertidos para 0 antes do cálculo final
    const finalQuantities = Object.keys(quantities).reduce((acc, key) => ({
        ...acc,
        [key]: quantities[key] === '' ? 0 : quantities[key]
    }), {});
    setQuantities(finalQuantities); // Atualiza o estado para garantir que '0' seja exibido se o campo estava vazio

    const total = materials.reduce((total, material) => total + (finalQuantities[material.id] * material.rate), 0);
    
    if (total === 0) {
      toast({
        title: "Atenção",
        description: "Por favor, insira a quantidade de pelo menos um material reciclável.",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };
  
  const handleFinalSubmit = async () => {
  if (!userData.email || !userData.cpf || !userData.birthdate || !userData.wallet) {
    toast({
      title: "Campos Obrigatórios",
      description: "Por favor, preencha todos os seus dados.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true); // ✅ ativa o loading
    const total = calculateTotal();
    const submission = {
      user: userData,
      materials: quantities,
      totalCrypto: total,
      timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/receber_dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });


    const result = await response.json();

    if (result.result === "success") {
      toast({
        title: "Cálculo Confirmado! 🎉",
        description: `Seus dados foram enviados com sucesso. Você receberá aproximadamente ${total.toFixed(6)} BTC!`,
      });

      setIsDialogOpen(false);
      setQuantities({ plastic: 0, glass: 0, paper: 0, metal: 0 });
      setUserData({ email: '', cpf: '', birthdate: '', wallet: '' });
    } else {
      throw new Error("Erro ao enviar os dados.");
    }
  } catch (error) {
    toast({
      title: "Erro",
      description: "Não foi possível enviar os dados. Tente novamente.",
      variant: "destructive",
    });
    console.error(error);
  } finally {
      setLoading(false); // ✅ desativa o loading
  }
};

  
  // NOVOS HANDLERS de Foco/Desfoco
  const handleFocus = (materialId) => {
    setFocusedInput(materialId);
    // Se o valor for 0, limpe-o para que o usuário possa digitar
    if (quantities[materialId] === 0) {
        setQuantities(prev => ({ ...prev, [materialId]: '' }));
    }
  };

  const handleBlur = (materialId) => {
    setFocusedInput(null);
    // Se o campo estiver vazio ao desfocar, defina-o como 0
    if (quantities[materialId] === '') {
        setQuantities(prev => ({ ...prev, [materialId]: 0 }));
    }
  };

  return (
    <>
      <Helmet>
        <title>Serviços - Calcule Seus Ganhos | GreenLoop</title>
        <meta name="description" content="Calcule quanto você pode ganhar em criptomoedas reciclando seus materiais. Plástico, vidro, papel e metal convertidos em BTC." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#538536] mb-6">Nossos Serviços</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Calcule quanto você pode ganhar em criptomoedas com seus materiais recicláveis</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-[#538536] p-3 rounded-full"><Calculator className="w-6 h-6 text-white" /></div>
                <h2 className="text-3xl font-bold text-[#538536]">Calculadora de Ganhos</h2>
              </div>

              <form onSubmit={handleOpenDialog} className="space-y-6">
                {materials.map((material) => {
                  const isActive = material.id === 'plastic'; // ✅ agora permitido

                  return (
                    <div key={material.id} className="space-y-2">
                      <Label htmlFor={material.id} className="flex items-center space-x-2 text-lg font-medium text-gray-700">
                        <div className={`bg-gradient-to-r ${material.color} p-2 rounded-lg`}>
                          <material.icon className="w-5 h-5 text-white" />
                        </div>
                        <span>{material.name} ({material.unit})</span>
                      </Label>

                      <div className="relative">
                        {isActive ? (
                          <>
                            <Input
                              id={material.id}
                              type="number"
                              min="0"
                              step="0.1"
                              value={quantities[material.id]}
                              onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                              onFocus={() => handleFocus(material.id)}
                              onBlur={() => handleBlur(material.id)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors text-lg"
                              placeholder="0.0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                              {material.unit}
                            </span>
                          </>
                        ) : (
                          <div className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg bg-gray-100 text-gray-500 text-center text-lg select-none">
                            EM BREVE...
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">Taxa: {material.rate} BTC por {material.unit}</p>
                    </div>
                  );
                })}

                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="bg-gradient-to-r from-[#538536] to-[#6ba84a] p-6 rounded-xl text-white mb-6">
                    <div className="text-sm font-medium mb-2">Total Estimado</div>
                    <div className="text-4xl font-bold">{calculateTotal().toFixed(6)} BTC</div>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" onClick={(e) => { e.preventDefault(); handleOpenDialog(e); }} size="lg" className="w-full gradient-green text-white hover:opacity-90 transition-opacity text-lg">Receber pagamento</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl text-[#538536]"><User/> Complete seus dados</DialogTitle>
                        <DialogDescription>Precisamos de algumas informações para processar seu pagamento.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4"/>Email</Label>
                          <Input id="email" name="email" type="email" placeholder="seu@email.com" value={userData.email} onChange={handleUserChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpf" className="flex items-center gap-2"><FileCheck className="w-4 h-4"/>CPF</Label>
                          <Input id="cpf" name="cpf" type="text" placeholder="000.000.000-00" value={userData.cpf} onChange={handleUserChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthdate" className="flex items-center gap-2"><Calendar className="w-4 h-4"/>Data de Nascimento</Label>
                          <Input id="birthdate" name="birthdate" type="date" value={userData.birthdate} onChange={handleUserChange} required />
                        </div>
                          <div className="space-y-2">
                          <Label htmlFor="wallet" className="flex items-center gap-2"><Wallet className="w-4 h-4"/>Wallet</Label>
                          <Input id="wallet" name="wallet" type="text" placeholder="Endereço da sua Wallet" value={userData.wallet} onChange={handleUserChange} required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleFinalSubmit} 
                        disabled={loading} // ✅ desativa enquanto envia
                        className="w-full gradient-blue text-white hover:opacity-90">Confirmar pagamento</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-6">Como Funciona</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Insira as Quantidades', desc: 'Digite quanto de cada material você tem para reciclar.' },
                    { title: 'Calcule Seus Ganhos', desc: 'Clique em calcular e preencha seus dados para ver o valor estimado.' },
                    { title: 'Envie Seus Materiais', desc: 'Entre em contato conosco para agendar a coleta ou o envio.' },
                    { title: 'Receba Suas Criptomoedas', desc: 'Após verificação, receba o pagamento direto na sua carteira informada.' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-[#538536] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">{index + 1}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                        <p className="text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-4">Materiais Aceitos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <div key={material.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className={`bg-gradient-to-r ${material.color} p-3 rounded-lg inline-block mb-2`}><material.icon className="w-6 h-6 text-white" /></div>
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

export default Services;