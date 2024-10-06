import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

function App() {
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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
