import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [balance, setBalance] = useState(null);
    const [username, setUsername] = useState('');
    const [amount, setAmount] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            // localStorage is used so user stays logged in, even after refreshing the page
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');  // Redirect to login if not authenticated
                return;
            }

            const response = await fetch('https://nevmo-fastapi-backend.onrender.com/users/me/', {
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

    const handleSendMoney = async () => {
        // clear previous messages
        setSuccessMessage(null);
        setErrorMessage(null);

        // handle edge cases
        if (!balance || balance <= 0) {
            setErrorMessage('Insufficient balance to send money.');
            return
        }
        if (amount <= 0 || amount > balance) {
            setErrorMessage('Invalid amount. Please enter a valid amount.');
            return;
        }
        if (recipient.trim() === '') {
            setErrorMessage('Please enter a recipient username.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://nevmo-fastapi-backend.onrender.com/send-money/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipient: recipient,
                    amount: amount,
                }),
            });

            // console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                setBalance(data.new_balance);
                setSuccessMessage('Money sent successfully');
                // reset amount after successful transaction
                setAmount(0);
                // reset recipient
                setRecipient('');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || 'Failed to send money');
            }
        } catch (err) {
            // console.log('Caught Error:', err);  // Log the caught error
            setErrorMessage('An error occurred while sending money.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Welcome to Nevmo</h1>
                <h2 className="text-xl font-bold text-center mb-6">Hello {username}!</h2>
                {balance !== null && <p className="text-xl text-center text-green-600 mb-6">Your balance is ${balance}</p>}
                <div className="space-y-4 mb-4">
                    <input
                        type="text"
                        placeholder="Recipient Username"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Amount to send"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMoney}
                        className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        Send Money
                    </button>
                </div>
                {successMessage && <p className="text-green-500 text-center mt-4 mb-4">{successMessage}</p>}
                {errorMessage && <p className="text-red-500 text-center mt-4 mb-4">{errorMessage}</p>}
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
