import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            localStorage.setItem('token', data.access_token);  // Save token
            navigate('/profile');  // Redirect to the profile page
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-6">Nevmo - Login</h1>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
