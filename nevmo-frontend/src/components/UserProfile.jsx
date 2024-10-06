import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [balance, setBalance] = useState(null);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            // localStorage is used so user stays logged in, even after refreshing the page
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');  // Redirect to login if not authenticated
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/users/me/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setBalance(userData.balance);
                setUsername(userData.username);
            } else {
                navigate('/');  // Redirect to login if unauthorized
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');  // Redirect to login on logout
    };

    const handleSendMoney = () => {
        alert("Send money clicked");
    };

    const handleDepositMoney = () => {
        alert("Deposit money clicked");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Welcome to Nevmo</h1>
                <h2 className="text-xl font-bold text-center mb-6">Hello {username}!</h2>
                {balance !== null && <p className="text-xl text-center text-green-600 mb-6">Your balance is ${balance}</p>}
                <div className="space-x-4 flex justify-center mb-6">
                    <button
                        onClick={handleSendMoney}
                        className="py-3 px-6 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        Send Money
                    </button>
                    <button
                        onClick={handleDepositMoney}
                        className="py-3 px-6 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        Deposit Money
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
