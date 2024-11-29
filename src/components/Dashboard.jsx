import React, { useEffect, useState } from 'react';
import { listarReceitas, criarReceita } from '../services/ReceitaService';
import { listarDespesas, criarDespesa } from '../services/DespesaService';
import { listarCategorias, cadastrarCategoria } from '../services/CategoriaService';

const Dashboard = ({ token }) => {
    const [receitas, setReceitas] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [novaReceita, setNovaReceita] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaCategoria, setNovaCategoria] = useState({ nome: '', tipo: 'RECEITA' });

    const userId = localStorage.getItem('id');

    useEffect(() => {
        const fetchData = async () => {
            const receitasData = await listarReceitas(token, userId);
            const despesasData = await listarDespesas(token, userId);
            const categoriasData = await listarCategorias(token);
            setReceitas(receitasData);
            setDespesas(despesasData);
            setCategorias(categoriasData);
        };
        fetchData();
    }, [token, userId]);

    const handleReceitaChange = (e) => {
        const { name, value } = e.target;
        setNovaReceita({ ...novaReceita, [name]: value });
    };

    const handleDespesaChange = (e) => {
        const { name, value } = e.target;
        setNovaDespesa({ ...novaDespesa, [name]: value });
    };

    const handleCategoriaChange = (e) => {
        const { name, value } = e.target;
        setNovaCategoria({ ...novaCategoria, [name]: value });
    };

    const handleReceitaSubmit = async (e) => {
        e.preventDefault();
        const createdReceita = await criarReceita({ ...novaReceita, usuario: userId }, token);
        setReceitas([...receitas, createdReceita]);
        setNovaReceita({ descricao: '', valor: '', data: '', categoria: '' });
    };

    const handleDespesaSubmit = async (e) => {
        e.preventDefault();
        const createdDespesa = await criarDespesa({ ...novaDespesa, usuario: userId }, token);
        setDespesas([...despesas, createdDespesa]);
        setNovaDespesa({ descricao: '', valor: '', data: '', categoria: '' });
    };

    const handleCategoriaSubmit = async (e) => {
        e.preventDefault();
        const createdCategoria = await cadastrarCategoria(novaCategoria, token);
        setCategorias([...categorias, createdCategoria]);
        setNovaCategoria({ nome: '', tipo: 'RECEITA' });
    };

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
            <h1 className="text-3xl mb-6">Gerenciamento AI</h1>
            <div className="mb-6">
                <h2 className="text-2xl mb-2">Receitas</h2>
                <table className="min-w-full bg-white mb-4">
                    <thead>
                        <tr>
                            <th className="py-2">Descrição</th>
                            <th className="py-2">Valor</th>
                            <th className="py-2">Data</th>
                            <th className="py-2">Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receitas.map((receita) => (
                            <tr key={receita.id}>
                                <td className="border px-4 py-2">{receita.descricao}</td>
                                <td className="border px-4 py-2">{receita.valor}</td>
                                <td className="border px-4 py-2">{receita.data}</td>
                                <td className="border px-4 py-2">{receita.categoria ? receita.categoria.nome : 'Sem Categoria'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <form onSubmit={handleReceitaSubmit} className="mb-4">
                    <h3 className="text-xl mb-2">Adicionar Nova Receita</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={novaReceita.descricao}
                        onChange={handleReceitaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={novaReceita.valor}
                        onChange={handleReceitaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={novaReceita.data}
                        onChange={handleReceitaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        name="categoria"
                        value={novaReceita.categoria}
                        onChange={handleReceitaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias.filter(categoria => categoria.tipo === 'RECEITA').map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Adicionar Receita</button>
                </form>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl mb-2">Despesas</h2>
                <table className="min-w-full bg-white mb-4">
                    <thead>
                        <tr>
                            <th className="py-2">Descrição</th>
                            <th className="py-2">Valor</th>
                            <th className="py-2">Data</th>
                            <th className="py-2">Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {despesas.map((despesa) => (
                            <tr key={despesa.id}>
                                <td className="border px-4 py-2">{despesa.descricao}</td>
                                <td className="border px-4 py-2">{despesa.valor}</td>
                                <td className="border px-4 py-2">{despesa.data}</td>
                                <td className="border px-4 py-2">{despesa.categoria ? despesa.categoria.nome : 'Sem Categoria'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <form onSubmit={handleDespesaSubmit} className="mb-4">
                    <h3 className="text-xl mb-2">Adicionar Nova Despesa</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={novaDespesa.descricao}
                        onChange={handleDespesaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={novaDespesa.valor}
                        onChange={handleDespesaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={novaDespesa.data}
                        onChange={handleDespesaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        name="categoria"
                        value={novaDespesa.categoria}
                        onChange={handleDespesaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias.filter(categoria => categoria.tipo === 'DESPESA').map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="bg-red-500 text-white p-2 rounded w-full">Adicionar Despesa</button>
                </form>
            </div>
            <div>
                <h2 className="text-2xl mb-2">Categorias</h2>
                <table className="min-w-full bg-white mb-4">
                    <thead>
                        <tr>
                            <th className="py-2">Nome</th>
                            <th className="py-2">Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td className="border px-4 py-2">{categoria.nome}</td>
                                <td className="border px-4 py-2">{categoria.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <form onSubmit={handleCategoriaSubmit} className="mb-4">
                    <h3 className="text-xl mb-2">Adicionar Nova Categoria</h3>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={novaCategoria.nome}
                        onChange={handleCategoriaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        name="tipo"
                        value={novaCategoria.tipo}
                        onChange={handleCategoriaChange}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </select>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Adicionar Categoria</button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;