// Caminho: src/components/ReceitaComponent.jsx

import React, { useEffect, useState } from 'react';
import { listarReceitas, criarReceita, atualizarReceita, deletarReceita } from '../services/ReceitaService.js';

const ReceitaComponent = ({ token }) => {
    const [receitas, setReceitas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await listarReceitas(token);
            setReceitas(data);
        };

        fetchData();
    }, [token]);

    const handleCreate = async () => {
        const newReceita = { /* dados da nova receita */ };
        const createdReceita = await criarReceita(newReceita, token);
        setReceitas([...receitas, createdReceita]);
    };

    const handleUpdate = async (id) => {
        const updatedReceita = { /* dados atualizados da receita */ };
        const updatedData = await atualizarReceita(id, updatedReceita, token);
        setReceitas(receitas.map(receita => receita.id === id ? updatedData : receita));
    };

    const handleDelete = async (id) => {
        await deletarReceita(id, token);
        setReceitas(receitas.filter(receita => receita.id !== id));
    };

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
            <h1 className="text-2xl mb-4">Receitas</h1>
            <ul className="mb-4">
                {receitas.map((receita, index) => (
                    <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
                        {receita.nome}: {receita.valor}
                    </li>
                ))}
            </ul>
            <button onClick={handleCreate} className="bg-green-500 text-white p-2 rounded w-full">Criar Nova Receita</button>
            {/* Adicione botões e handlers para atualizar e deletar receitas */}
        </div>
    );
};

export default ReceitaComponent;