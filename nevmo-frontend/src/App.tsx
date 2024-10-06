import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';

function App() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const data = await response.json();
      setToken(data.access_token);
      setError('');

      // fetch user balance after login
      const balanceResponse = await fetch('http://127.0.0.1:8000/users/me/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      });
      const userData = await balanceResponse.json();
      setBalance(userData.balance);

    } catch (err) {
      setError('Unexpected error occured');
    }
  };

  const handleSendMoney = () => {
    alert("Send money clicked");
  };

  const handleReceiveMoney = () => {
    alert("Receive money clicked");
  };


  // const fetchBalance = async () => {
  //   const response = await fetch("http://127.0.0.1:8000/balance", {
  //     headers: {
  //       // replace with actual JWT
  //       Authorization: "Bearer dummy_token"
  //     },
  //   })
  //   const data = await response.json();
  //   setBalance(data.balance);
  // };

  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    //   <div className='bg-white p-6 rounded-lg shadow-lg'>
    //     <h1 className="text-2xl font-bold mb-4">Nevmo Balance</h1>
    //     <button onClick={fetchBalance} className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Get Balance</button>
    //     {balance && (<p className="mt-4 text-lg"> Current Balance: <strong>${balance}</strong></p>
    //     )}
    //   </div>
    // </div>
    <div>
      <h1>Nevmo - Login</h1>
      <input type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
      <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {balance !== null && (
        <>
          <p>Balance: ${balance}</p>
          <button onClick={handleSendMoney}>Send Money</button>
          <button onClick={handleReceiveMoney}>Receive Money</button>
        </>
      )}
    </div>
  );
}

export default App;
