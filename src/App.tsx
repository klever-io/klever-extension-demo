import React, { useState } from 'react';
import './App.css';

import klever from './providers/klever';

const App: React.FC = () => {
  const [error, setError] = useState('');
  const [kleverConnected, setKleverConnected] = useState(false);

  return (
    <>
      <h1>Providers</h1>
      <div className="container">
        <button
          style={{ backgroundColor: kleverConnected ? 'green' : '#1a1a1a' }}
          onClick={async () => {
            const address = await klever.connect();
            if (!address.startsWith('klv')) {
              setError(address);
            }

            setKleverConnected(true);
          }}
        >
          KleverWeb
        </button>
        <button>TronWeb</button>
        <button>Web3</button>
      </div>
      {error && <p onClick={() => setError('')}>{error}</p>}
    </>
  );
};

export default App;
