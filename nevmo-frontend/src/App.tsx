import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';

function App() {

  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = async () => {
    const response = await fetch("http://127.0.0.1:8000/balance", {
      headers: {
        // replace with actual JWT
        Authorization: "Bearer dummy_token"
      },
    })
    const data = await response.json();
    setBalance(data.balance);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h1 className="text-2xl font-bold mb-4">Nevmo Balance</h1>
        <button onClick={fetchBalance} className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Get Balance</button>
        {balance && (<p className="mt-4 text-lg"> Current Balance: <strong>${balance}</strong></p>
        )}
      </div>
    </div>
  );
}

export default App;
