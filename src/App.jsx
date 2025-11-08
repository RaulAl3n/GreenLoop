import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import { sdk } from "@farcaster/miniapp-sdk";

const App = () => {
  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (error) {
      // Erro silencioso - Farcaster SDK opcional
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/calcular" element={<Services />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/contato" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
