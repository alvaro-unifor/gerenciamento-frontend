// src/App.jsx
import React, { useState } from 'react';
import AuthComponent from './components/AuthComponent.jsx';
import Dashboard from './components/Dashboard.jsx';
import './index.css';

const App = () => {
    const [token, setToken] = useState('');

    const handleLoginSuccess = (token) => {
        setToken(token);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {token ? (
                <Dashboard token={token} />
            ) : (
                <AuthComponent onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;