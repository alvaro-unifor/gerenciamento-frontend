// src/components/AuthComponent.jsx
import React, { useState } from 'react';
import { login, register } from '../services/AuthService.js';

const AuthComponent = ({ onLoginSuccess }) => {
    const [loginData, setLoginData] = useState({ login: '', senha: '' });
    const [registerData, setRegisterData] = useState({ login: '', senha: '', role: 'USER' });
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const data = await login(loginData);
        if (data && data.token) {
            onLoginSuccess(data.token);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        await register(registerData);
        setIsRegistering(false);
    };

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            {isRegistering ? (
                <form onSubmit={handleRegisterSubmit}>
                    <h2 className="text-2xl mb-4">Register</h2>
                    <input
                        type="text"
                        name="login"
                        placeholder="Login"
                        value={registerData.login}
                        onChange={handleRegisterChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={registerData.senha}
                        onChange={handleRegisterChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Register</button>
                    <button type="button" onClick={() => setIsRegistering(false)} className="mt-4 text-blue-500">Back to Login</button>
                </form>
            ) : (
                <form onSubmit={handleLoginSubmit}>
                    <h2 className="text-2xl mb-4">Login</h2>
                    <input
                        type="text"
                        name="login"
                        placeholder="Login"
                        value={loginData.login}
                        onChange={handleLoginChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={loginData.senha}
                        onChange={handleLoginChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
                    <button type="button" onClick={() => setIsRegistering(true)} className="mt-4 text-blue-500">Register</button>
                </form>
            )}
        </div>
    );
};

export default AuthComponent;