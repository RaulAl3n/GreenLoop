import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import WagmiProvider from '@/providers/WagmiProvider';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider>
    <App />
  </WagmiProvider>
);
