import React, { useEffect, useState } from 'react';
import './App.css';
import ethereum from './providers/ethereum';

import klever from './providers/klever';

const App: React.FC = () => {
  const [error, setError] = useState('');
  const [kleverConnected, setKleverConnected] = useState(false);
  const [tronConnected, setTronConnected] = useState(false);
  const [ethConnected, setEthConnected] = useState(false);

  useEffect(() => {
    const watcher = setInterval(() => {
      if (!window.tronWeb || !window.tronWeb.ready) {
        return;
      }

      if (window.tronWeb.defaultAddress.base58) {
        setTronConnected(true);
        clearInterval(watcher);
      }
    }, 500);

    return () => {
      clearInterval(watcher);
    };
  }, []);

  const connectToKlever = async () => {
    const address = await klever.connect();
    if (!address.startsWith('klv')) {
      setError(address);
    }

    setKleverConnected(true);
  };

  const connectToEth = async () => {
    const address = await ethereum.connect();
    if (!address.startsWith('0x')) {
      setError(address);
    }

    setEthConnected(true);
  };

  const connectedStyle = (provider: boolean) => {
    return { backgroundColor: provider ? 'green' : '#1a1a1a' };
  };

  return (
    <>
      <h1>Providers</h1>
      <div className="container">
        <button
          style={connectedStyle(kleverConnected)}
          onClick={connectToKlever}
        >
          KleverWeb
        </button>
        <button style={connectedStyle(tronConnected)}>TronWeb</button>
        <button style={connectedStyle(ethConnected)} onClick={connectToEth}>
          Web3
        </button>
      </div>
      {error && <p onClick={() => setError('')}>{error}</p>}
    </>
  );
};

export default App;
