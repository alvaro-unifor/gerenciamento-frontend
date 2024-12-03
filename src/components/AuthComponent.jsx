// src/components/AuthComponent.jsx
import React, { useState } from 'react';
import { login, register } from '../services/AuthService.js';

const AuthComponent = ({ onLoginSuccess }) => {
    const [loginData, setLoginData] = useState({ login: '', senha: '' });
    const [registerData, setRegisterData] = useState({ login: '', senha: '', role: 'USER' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro

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
        setErrorMessage(''); // Limpar mensagem de erro ao tentar logar novamente
        const data = await login(loginData);
        if (data && data.token) {
            onLoginSuccess(data.token);
        } else {
            setErrorMessage('Usuário não encontrado ou senha incorreta.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        await register(registerData);
        setIsRegistering(false);
    };

    return (
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
    {isRegistering ? (
        <form onSubmit={handleRegisterSubmit}>
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Registrar</h2>
            
            <input
                type="text"
                name="login"
                placeholder="Login"
                value={registerData.login}
                onChange={handleRegisterChange}
                className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={registerData.senha}
                onChange={handleRegisterChange}
                className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button 
                type="submit" 
                className="border-2 border-blue-500 text-blue-500 p-3 rounded-lg w-full transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
            >
                Registrar Agora!
            </button>
            
            <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="mt-4 text-blue-500 hover:underline"
            >
                Voltar para login!
            </button>
        </form>
            ) : (
                <form onSubmit={handleLoginSubmit} className="bg-blue-100 p-10 rounded-lg shadow-lg w-full max-w-md mx-auto">
    <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Login</h2>
    
    {/* Caixa de Entrada para Login */}
    <input
        type="text"
        name="login"
        placeholder="Login"
        value={loginData.login}
        onChange={handleLoginChange}
        className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    
    {/* Caixa de Entrada para Senha */}
    <input
        type="password"
        name="senha"
        placeholder="Senha"
        value={loginData.senha}
        onChange={handleLoginChange}
        className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    
    {/* Botão de Login */}
    <button
        type="submit"
        className="border-2 border-blue-500 text-blue-500 p-3 rounded-lg w-full transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
    >
        Entrar
    </button>

    {/* Mensagem de erro */}
    {errorMessage && (
        <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
    )}

    {/* Link para Registro */}
    <button
        type="button"
        onClick={() => setIsRegistering(true)}
        className="mt-4 text-blue-500 hover:underline"
    >
        Clique aqui para se registar!
    </button>
</form>


            )}
        </div>
    );
};

export default AuthComponent;