import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, Trash2, Wine, DollarSign, Scale, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { uploadToPinata } from '@/lib/pinata';
import glPETAbi from '@/abi/glPET-abi.json';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import TokenChart from '@/components/TokenChart';

const CONTRACT_ADDRESS = '0x35FbA5dE07ed5479c8a151b78013b8Fea0FE67B4';

const Services = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending: isWriting, error: writeError, reset: resetWrite } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });
  const [petData, setPetData] = useState({
    quantidade: '',
    unidade: 'kg',
    valorReais: 0,
    valorUnidade: 'reais',
    recicladorAddress: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const total = calculateTotal();
      
      toast({
        title: "Mint realizado com sucesso! 🎉",
        description: `Reciclador recebeu ${total.toFixed(4)} glPET!`,
      });
      setIsDialogOpen(false);
      setPetData({ quantidade: '', unidade: 'kg', valorReais: 0, valorUnidade: 'reais', recicladorAddress: '' });
      setLoading(false);
      resetWrite();
    }
  }, [isSuccess, resetWrite]);

  useEffect(() => {
    if (writeError || receiptError) {
      const errorMessage = writeError?.message || receiptError?.message || 'Transação cancelada ou falhou';
      
      if (errorMessage.includes('rejected') || errorMessage.includes('denied') || errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
        toast({
          title: "Transação cancelada",
          description: "A transação foi cancelada pelo usuário.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro na transação",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      setLoading(false);
      resetWrite();
    }
  }, [writeError, receiptError, resetWrite]);

  const handlePetChange = (field, value) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };

  const isValidEthereumAddress = (address) => {
    if (!address) return false;
    const trimmed = address.trim();
    if (!trimmed.startsWith('0x') || trimmed.length !== 42) return false;
    const hexPart = trimmed.slice(2);
    return /^[0-9a-fA-F]{40}$/.test(hexPart);
  };

  const convertToKg = (value, unit) => {
    if (!value) return 0;
    const numValue = parseFloat(value) || 0;
    return unit === 'g' ? numValue / 1000 : numValue;
  };

  const convertFromKg = (kg, unit) => {
    if (!kg) return '';
    return unit === 'g' ? (kg * 1000).toString() : kg.toString();
  };


  const handleUnitToggle = () => {
    const newUnit = petData.unidade === 'kg' ? 'g' : 'kg';
    const currentKg = convertToKg(petData.quantidade, petData.unidade);
    const newValue = convertFromKg(currentKg, newUnit);
    setPetData(prev => ({ ...prev, unidade: newUnit, quantidade: newValue }));
  };

  const handleValorUnitToggle = () => {
    setPetData(prev => {
      const indoParaCentavos = prev.valorUnidade === 'reais';
      const novoValorReais = indoParaCentavos
        ? prev.valorReais / 100
        : prev.valorReais * 100;
      return {
        ...prev,
        valorUnidade: indoParaCentavos ? 'centavos' : 'reais',
        valorReais: Number.isFinite(novoValorReais) ? +novoValorReais : 0,
      };
    });
  };

  const calculateTotal = () => {
    const kg = convertToKg(petData.quantidade, petData.unidade);
    if (kg <= 0 || petData.valorReais <= 0) return 0;
    return kg * petData.valorReais;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpenDialog = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isConnected) {
      toast({
        title: "Wallet não conectada",
        description: "Por favor, conecte sua wallet para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!petData.quantidade || !petData.quantidade.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a quantidade.",
        variant: "destructive",
      });
      return;
    }

    const valorNum = parseFloat(petData.valorReais);
    if (!petData.valorReais || isNaN(valorNum) || valorNum <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha um valor maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!petData.recicladorAddress || !petData.recicladorAddress.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o endereço do reciclador.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEthereumAddress(petData.recicladorAddress)) {
      toast({
        title: "Endereço inválido",
        description: "O endereço do reciclador deve ser um endereço Ethereum válido (0x seguido de 40 caracteres hexadecimais).",
        variant: "destructive",
      });
      return;
    }

    const kg = convertToKg(petData.quantidade, petData.unidade);
    if (kg <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "A quantidade em kg deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setIsDialogOpen(true);
  };
  
  const handleFinalSubmit = async () => {
    if (!petData.quantidade || !petData.quantidade.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha a quantidade.",
        variant: "destructive",
      });
      return;
    }

    const valorNum = parseFloat(petData.valorReais);
    if (!petData.valorReais || isNaN(valorNum) || valorNum <= 0) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha um valor maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!petData.recicladorAddress || !petData.recicladorAddress.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o endereço do reciclador.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEthereumAddress(petData.recicladorAddress)) {
      toast({
        title: "Endereço inválido",
        description: "O endereço do reciclador deve ser um endereço Ethereum válido (0x seguido de 40 caracteres hexadecimais).",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, conecte sua wallet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const total = calculateTotal();
    
    try {
      const submission = {
        petData: {
          quantidade: petData.quantidade,
          unidade: petData.unidade,
          quantidadeKg: convertToKg(petData.quantidade, petData.unidade),
          valorReais: petData.valorReais,
          valorCentavos: Math.round(petData.valorReais * 100),
          timestamp: currentTimestamp,
        },
        recicladorAddress: petData.recicladorAddress,
        adminAddress: address,
        totalTokens: total,
      };

      toast({
        title: "Fazendo upload no IPFS...",
        description: "Enviando dados para o Pinata...",
      });

      const result = await uploadToPinata(submission);
      const cid = result.cid || result.IpfsHash || result.ipfsHash;

      if (!cid) {
        throw new Error('Edge Function não retornou o CID');
      }

      toast({
        title: "Upload concluído!",
        description: `CID: ${cid}. Iniciando mint...`,
      });

      const amountInWei = parseEther(total.toString());

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: glPETAbi,
        functionName: 'mint',
        args: [petData.recicladorAddress, amountInWei],
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar a transação. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Calcular - Calcule Seus Ganhos | GreenLoop</title>
        <meta name="description" content="Calcule quanto você pode ganhar em criptomoedas reciclando suas Garrafas PET. Converta em glPET." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#538536] mb-6">Calcular</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Calcule quanto você pode ganhar em criptomoedas com suas Garrafas PET</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-[#538536] p-3 rounded-full"><Calculator className="w-6 h-6 text-white" /></div>
                <h2 className="text-3xl font-bold text-[#538536]">Calculadora de Ganhos</h2>
              </div>

              <form onSubmit={handleOpenDialog} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pet" className="flex items-center space-x-2 text-lg font-medium text-gray-700">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <span>Garrafas PET</span>
                  </Label>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="quantidade" className="flex items-center gap-2 text-sm text-gray-600">
                          <Scale className="w-4 h-4" />
                          Quantidade
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium transition-colors ${petData.unidade === 'kg' ? 'text-[#538536]' : 'text-gray-400'}`}>kg</span>
                          <button
                            type="button"
                            onClick={handleUnitToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#538536] focus:ring-offset-2 ${
                              petData.unidade === 'g' ? 'bg-[#538536]' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                petData.unidade === 'g' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-xs font-medium transition-colors ${petData.unidade === 'g' ? 'text-[#538536]' : 'text-gray-400'}`}>g</span>
                        </div>
                      </div>
                      <Input
                        id="quantidade"
                        type="number"
                        min="0"
                        step={petData.unidade === 'kg' ? "0.1" : "1"}
                        value={petData.quantidade}
                        onChange={(e) => handlePetChange('quantidade', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors text-lg"
                        placeholder="0.0"
                        required
                      />
                      {petData.valorReais > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {petData.unidade === 'kg' 
                            ? `1 kg × ${petData.valorReais.toFixed(2)} R$ = ${(1 * petData.valorReais).toFixed(6)} glPET`
                            : `1000 g = 1 kg × ${petData.valorReais.toFixed(2)} R$ = ${(1 * petData.valorReais).toFixed(6)} glPET`}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="valor" className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          Valor
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium transition-colors ${petData.valorUnidade === 'reais' ? 'text-[#538536]' : 'text-gray-400'}`}>R$</span>
                          <button
                            type="button"
                            onClick={handleValorUnitToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#538536] focus:ring-offset-2 ${
                              petData.valorUnidade === 'centavos' ? 'bg-[#538536]' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                petData.valorUnidade === 'centavos' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-xs font-medium transition-colors ${petData.valorUnidade === 'centavos' ? 'text-[#538536]' : 'text-gray-400'}`}>centavos</span>
                        </div>
                      </div>
                      <Input
                        id="valor"
                        type="number"
                        min="0"
                        step="0.01"
                        value={petData.valorReais === 0 ? '' : String(petData.valorReais)}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPetData(prev => ({ ...prev, valorReais: v === '' ? 0 : (parseFloat(v) || 0) }));
                        }}
                        onBlur={(e) => {
                          if (petData.valorUnidade === 'reais' && petData.valorReais > 0) {
                            setPetData(prev => ({ ...prev, valorReais: parseFloat(prev.valorReais.toFixed(2)) }));
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors text-lg"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Label htmlFor="data" className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        Data e Hora
                      </Label>
                      <Input
                        id="data"
                        type="text"
                        value={formatDate(currentTimestamp)}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-lg cursor-not-allowed"
                      />
                    </div>

                    <div className="relative">
                      <Label htmlFor="recicladorAddress" className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <Wallet className="w-4 h-4" />
                        Endereço do Reciclador
                      </Label>
                      <Input
                        id="recicladorAddress"
                        type="text"
                        value={petData.recicladorAddress}
                        onChange={(e) => handlePetChange('recicladorAddress', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors text-lg font-mono text-sm"
                        placeholder="0x..."
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glass" className="flex items-center space-x-2 text-lg font-medium text-gray-700">
                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-2 rounded-lg">
                      <Wine className="w-5 h-5 text-white" />
                    </div>
                    <span>Vidro</span>
                  </Label>
                  <div className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg bg-gray-100 text-gray-500 text-center text-lg select-none">
                    EM BREVE...
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="bg-gradient-to-r from-[#538536] to-[#6ba84a] p-6 rounded-xl text-white mb-6">
                    <div className="text-sm font-medium mb-2">Total Estimado</div>
                    <div className="text-4xl font-bold">{calculateTotal().toFixed(6)} glPET</div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gradient-green text-white hover:opacity-90 transition-opacity text-lg"
                    disabled={!isConnected}
                  >
                    Enviar valores
                  </Button>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-[#538536]">Confirmar Envio</DialogTitle>
                        <DialogDescription>Revise os dados antes de enviar.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Quantidade:</p>
                          <p className="text-lg">{petData.quantidade} {petData.unidade} ({convertToKg(petData.quantidade, petData.unidade).toFixed(2)} kg)</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Valor:</p>
                          <p className="text-lg">
                            {petData.valorReais.toFixed(2)} {petData.valorUnidade === 'reais' ? 'R$' : 'R$ (centavos)'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Data:</p>
                          <p className="text-lg">{formatDate(currentTimestamp)}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Endereço do Reciclador:</p>
                          <p className="text-lg font-mono text-xs break-all">{petData.recicladorAddress}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Tokens a receber:</p>
                          <p className="text-lg font-bold text-[#538536]">{calculateTotal().toFixed(4)} glPET</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleFinalSubmit} 
                          disabled={loading || isWriting || isConfirming || !isConnected}
                          className="w-full gradient-blue text-white hover:opacity-90"
                        >
                          {isWriting ? 'Assinando transação...' : isConfirming ? 'Confirmando...' : loading ? 'Processando...' : 'Confirmar envio'}
                        </Button>
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
                    { title: 'Insira os Dados', desc: 'Digite a quantidade em kg ou gramas, valor em reais ou centavos e endereço do reciclador.' },
                    { title: 'Calcule Seus Ganhos', desc: 'Veja quantos tokens glPET serão enviados (quantidade + valor).' },
                    { title: 'Conecte sua Wallet', desc: 'Apenas o administrador pode enviar os valores.' },
                    { title: 'Receba Seus Tokens', desc: 'Após confirmação, os tokens glPET são enviados para o reciclador.' }
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
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg inline-block">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">Garrafas PET</div>
                    <TokenChart compact={true} materialName="pet" />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm opacity-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-3 rounded-lg inline-block">
                        <Wine className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">Vidro</div>
                    <div className="text-sm text-gray-600">Em breve</div>
                  </div>
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
