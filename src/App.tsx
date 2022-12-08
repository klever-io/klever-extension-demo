import React, { ReactEventHandler, useEffect, useRef, useState } from 'react';
import './App.css';
import ethereum from './providers/ethereum';

import klever from './providers/klever';

const App: React.FC = () => {
  const [error, setError] = useState('');
  const [kleverConnected, setKleverConnected] = useState(false);
  const [tronConnected, setTronConnected] = useState(false);
  const [ethConnected, setEthConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<number>();
  const toRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const amountRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [txHash, setTxHash] = useState<string | undefined>();

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

  const fetchBalance = async () => {
    const amount = await klever.balance()
    setBalance(amount / Math.pow(10, 6))
  }

  const connectToKlever = async () => {
    const address = await klever.connect();
    if (!address.startsWith('klv')) {
      setError(address);
    }

    setKleverConnected(true);
    setAddress(klever.address);
    await fetchBalance()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const to = toRef?.current?.value
    const amount = amountRef?.current?.value

    if (to && amount) {
      console.log({ to, amount })
      const data = await klever.send(to, parseInt(amount))
      setTxHash(JSON.stringify(data))
    }
  }

  return (
    <div>
      <h1>Klever Extension Connect</h1>
      <div className='flex space-around'>
        <div className='container'>
          <h2>Providers</h2>
          <div className='flex items-center space-around'>
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
        </div>

        <div className='container'>
          <h2>Account</h2>
          <p className='text'><b>{address}</b></p>
          <p><b>Balance:</b> KLV {balance}</p>
        </div>

        <div className='container'>
          <h2>Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>To:</label>
              <input required name="to" ref={toRef} />
            </div>
            <br />
            <div>
              <label>Amount:</label>
              <input required type="number" name="amount" ref={amountRef} />
            </div>
            <br />
            <button className="btn-submit" type="submit">Submit</button>
          </form>
          {txHash && (
            <div>
              <br />
              <p className='text'><code>{txHash}</code></p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default App;
