import React, { useEffect, useState } from 'react';
import { listarReceitas, criarReceita , deletarReceita, atualizarReceita, listarMaioresReceitas,listarMenoresReceitas,listarReceitasPorMes,listarReceitasPorPeriodo} from '../services/ReceitaService';
import { listarDespesas, criarDespesa, deletarDespesa, atualizarDespesa, listarMaioresDespesas, listarMenoresDespesas, listarDespesasPorMes, listarDespesasPorPeriodo} from '../services/DespesaService';
import { listarCategorias, cadastrarCategoria } from '../services/CategoriaService';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement} from 'chart.js'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ token }) => {
    const [receitas, setReceitas] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [novaReceita, setNovaReceita] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaCategoria, setNovaCategoria] = useState({ nome: '', tipo: 'RECEITA' });
    const [despesaEditando, setDespesaEditando] = useState(null);
    const [receitaEditando, setReceitaEditando] = useState(null);
    const [filtroSelecionado, setFiltroSelecionado] = useState('todas');
    const [receitasFiltradas, setReceitasFiltradas] = useState([]);
    const [despesasFiltradas, setDespesasFiltradas] = useState([]);
    const [filtros, setFiltros] = useState({ ano: '', mes: '', dataInicio: '', dataFim: '', limite: '' });



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

    const handleDeleteReceita = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta receita?");
        if (confirmDelete) {
            const success = await deletarReceita(id, token);
            if (success) {
                setReceitas(receitas.filter((receita) => receita.id !== id));
            } else {
                alert("Erro ao excluir a receita. Tente novamente.");
            }
        }
    };

    const handleDeleteDespesa = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta despesa?");
        if (confirmDelete) {
            const success = await deletarDespesa(id, token);
            if (success) {
                setDespesas(despesas.filter((despesa) => despesa.id !== id));
            } else {
                alert("Erro ao excluir a despesa. Tente novamente.");
            }
        }
    };

    const handleEditDespesa = (despesa) => {
        setDespesaEditando(despesa); // Define a despesa que será editada
    };
    
    const handleSaveDespesa = async () => {
        if (despesaEditando) {
            const success = await atualizarDespesa(despesaEditando.id, despesaEditando, token);
            if (success) {
                setDespesas(despesas.map((despesa) => (despesa.id === despesaEditando.id ? despesaEditando : despesa)));
                setDespesaEditando(null); // Fecha o modo de edição
            } else {
                alert("Erro ao atualizar a despesa. Tente novamente.");
            }
        }
    };

    const handleEditReceita = (receita) => {
        setReceitaEditando(receita); // Define a receita que será editada
    };
    

    const handleSaveReceita = async () => {
        if (receitaEditando) {
            const success = await atualizarReceita(receitaEditando.id, receitaEditando, token);
            if (success) {
                setReceitas(receitas.map((receita) => (receita.id === receitaEditando.id ? receitaEditando : receita)));
                setReceitaEditando(null); // Fecha o modo de edição
            } else {
                alert("Erro ao atualizar a receita. Tente novamente.");
            }
        }
    };
    
    const aplicarFiltroReceita = async () => {
        try {
            switch (filtroSelecionado) {
                case 'todas':
                    const todasReceitas = await listarReceitas(token, userId);
                    setReceitasFiltradas(todasReceitas);
                    break;
                case 'porMes':
                    const { ano, mes } = filtros;
                    if (ano && mes) {
                        const receitasPorMes = await listarReceitasPorMes(ano, mes, token);
                        setReceitasFiltradas(receitasPorMes);
                    } else {
                        alert('Preencha o ano e o mês para filtrar.');
                    }
                    break;
                case 'porPeriodo':
                    const { dataInicio, dataFim } = filtros;
                    if (dataInicio && dataFim) {
                        const receitasPorPeriodo = await listarReceitasPorPeriodo(dataInicio, dataFim, token);
                        setReceitasFiltradas(receitasPorPeriodo);
                    } else {
                        alert('Preencha as datas de início e fim para filtrar.');
                    }
                    break;
                case 'maiores':
                    if (filtros.limite) {
                        const maioresReceitas = await listarMaioresReceitas(filtros.limite, token);
                        setReceitasFiltradas(maioresReceitas);
                    } else {
                        alert('Preencha o limite para filtrar.');
                    }
                    break;
                case 'menores':
                    if (filtros.limite) {
                        const menoresReceitas = await listarMenoresReceitas(filtros.limite, token);
                        setReceitasFiltradas(menoresReceitas);
                    } else {
                        alert('Preencha o limite para filtrar.');
                    }
                    break;
                default:
                    alert('Filtro não implementado.');
            }
        } catch (error) {
            console.error('Erro ao aplicar o filtro:', error);
        }
    };

    const aplicarFiltroDespesa = async () => {
        try {
            switch (filtroSelecionado) {
                case 'todas':
                    const todasDespesas = await listarDespesas(token, userId);
                    setDespesasFiltradas(todasDespesas);
                    break;
                case 'porMes':
                    const { ano, mes } = filtros;
                    if (ano && mes) {
                        const receitasPorMes = await listarDespesasPorMes(ano, mes, token);
                        setDespesasFiltradas(receitasPorMes);
                    } else {
                        alert('Preencha o ano e o mês para filtrar.');
                    }
                    break;
                case 'porPeriodo':
                    const { dataInicio, dataFim } = filtros;
                    if (dataInicio && dataFim) {
                        const despesasPorPeriodo = await listarDespesasPorPeriodo(dataInicio, dataFim, token);
                        setDespesasFiltradas(despesasPorPeriodo);
                    } else {
                        alert('Preencha as datas de início e fim para filtrar.');
                    }
                    break;
                case 'maiores':
                    if (filtros.limite) {
                        const maioresDespesas = await listarMaioresDespesas(filtros.limite, token);
                        setDespesasFiltradas(maioresDespesas);
                    } else {
                        alert('Preencha o limite para filtrar.');
                    }
                    break;
                case 'menores':
                    if (filtros.limite) {
                        const menoresDespesas = await listarMenoresDespesas(filtros.limite, token);
                        setDespesasFiltradas(menoresDespesas);
                    } else {
                        alert('Preencha o limite para filtrar.');
                    }
                    break;
                default:
                    alert('Filtro não implementado.');
            }
        } catch (error) {
            console.error('Erro ao aplicar o filtro:', error);
        }
    };
    
    
    
    const receitasData = {
        labels: receitas.map((receita) => receita.descricao),
        datasets: [
            {
                label: 'Receitas',
                data: receitas.map((receita) => receita.valor),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const despesasData = {
        labels: despesas.map((despesa) => despesa.descricao),
        datasets: [
            {
                label: 'Despesas',
                data: despesas.map((despesa) => despesa.valor),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };
  


    
return (
    <div className="bg-gray-50 p-10 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-4xl mb-8 text-center text-blue-600">Gerenciamento AI</h1>

        {/* Seção de Receitas */}
        <div className="mb-10">
            <h2 className="text-4xl mb-6 text-teal-700 font-semibold">Receitas</h2>
            <Bar data={receitasData} />

            {/* Filtros de Receitas */}
            <div className="mb-8">
                <h3 className="text-3xl mb-6 text-teal-600">Filtrar Receitas</h3>
                <select
                    value={filtroSelecionado}
                    onChange={(e) => setFiltroSelecionado(e.target.value)}
                    className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-teal-50"
                >
                    <option value="todas">Todas as Receitas</option>
                    <option value="porMes">Por Mês</option>
                    <option value="porPeriodo">Por Período</option>
                    <option value="maiores">Maiores Receitas</option>
                    <option value="menores">Menores Receitas</option>
                </select>

                {/* Inputs dinâmicos para filtros */}
                {filtroSelecionado === 'porMes' && (
                    <div className="flex space-x-6 mb-6">
                        <input
                            type="number"
                            placeholder="Ano"
                            value={filtros.ano}
                            onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                            className="p-4 border border-teal-400 rounded-xl bg-teal-50"
                        />
                        <input
                            type="number"
                            placeholder="Mês"
                            value={filtros.mes}
                            onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
                            className="p-4 border border-teal-400 rounded-xl bg-teal-50"
                        />
                    </div>
                )}
                {filtroSelecionado === 'porPeriodo' && (
                    <div className="flex space-x-6 mb-6">
                        <input
                            type="date"
                            placeholder="Data Início"
                            value={filtros.dataInicio}
                            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                            className="p-4 border border-teal-400 rounded-xl bg-teal-50"
                        />
                        <input
                            type="date"
                            placeholder="Data Fim"
                            value={filtros.dataFim}
                            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                            className="p-4 border border-teal-400 rounded-xl bg-teal-50"
                        />
                    </div>
                )}
                {(filtroSelecionado === 'maiores' || filtroSelecionado === 'menores') && (
                    <input
                        type="number"
                        placeholder="Limite"
                        value={filtros.limite}
                        onChange={(e) => setFiltros({ ...filtros, limite: e.target.value })}
                        className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-teal-50"
                    />
                )}

                <button
                    onClick={aplicarFiltroReceita}
                    className="bg-teal-600 text-white p-4 rounded-xl w-full border-2 border-teal-600 transition-colors duration-300 ease-in-out hover:bg-white hover:text-teal-600 hover:border-teal-600 active:bg-gray-200 active:text-teal-700"
                >
                    Aplicar Filtro
                </button>
            </div>

            {/* Tabela de Receitas */}
            <table className="min-w-full bg-white mb-8 rounded-xl shadow-lg">
                <thead>
                    <tr className="bg-teal-100">
                        <th className="py-4 px-6">Descrição</th>
                        <th className="py-4 px-6">Valor</th>
                        <th className="py-4 px-6">Data</th>
                        <th className="py-4 px-6">Categoria</th>
                        <th className="py-4 px-6">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {(receitasFiltradas.length > 0 ? receitasFiltradas : receitas).map((receita) => (
                        <tr key={receita.id} className="border-t">
                            <td className="py-4 px-6">{receita.descricao}</td>
                            <td className="py-4 px-6">{receita.valor}</td>
                            <td className="py-4 px-6">{receita.data}</td>
                            <td className="py-4 px-6">{receita.descricaoCategoria ? receita.descricaoCategoria : 'Sem Categoria'}</td>
                            <td className="py-4 px-6 flex space-x-4">
                                <button
                                    onClick={() => handleDeleteReceita(receita.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Excluir
                                </button>
                                <button
                                    onClick={() => handleEditReceita(receita)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {receitaEditando && (
                <div className="mb-8 p-6 bg-teal-50 rounded-xl shadow-lg">
                    <h3 className="text-3xl mb-6 text-teal-600">Editar Receita</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={receitaEditando.descricao}
                        onChange={(e) =>
                            setReceitaEditando({ ...receitaEditando, descricao: e.target.value })
                        }
                        className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={receitaEditando.valor}
                        onChange={(e) =>
                            setReceitaEditando({ ...receitaEditando, valor: e.target.value })
                        }
                        className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={receitaEditando.data}
                        onChange={(e) =>
                            setReceitaEditando({ ...receitaEditando, data: e.target.value })
                        }
                        className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                    />
                    <select
                        name="categoria"
                        value={receitaEditando.categoria}
                        onChange={(e) =>
                            setReceitaEditando({ ...receitaEditando, categoria: e.target.value })
                        }
                        className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias
                            .filter((categoria) => categoria.tipo === 'RECEITA')
                            .map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                    </select>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSaveReceita}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl"
                        >
                            Salvar
                        </button>
                        <button
                            onClick={() => setReceitaEditando(null)}
                            className="bg-gray-600 text-white px-6 py-3 rounded-xl"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleReceitaSubmit} className="mb-8 p-6 bg-teal-50 rounded-xl shadow-lg">
                <h3 className="text-3xl mb-6 text-teal-600">Adicionar Nova Receita</h3>
                <input
                    type="text"
                    name="descricao"
                    placeholder="Descrição"
                    value={novaReceita.descricao}
                    onChange={handleReceitaChange}
                    className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                />
                <input
                    type="number"
                    name="valor"
                    placeholder="Valor"
                    value={novaReceita.valor}
                    onChange={handleReceitaChange}
                    className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                />
                <input
                    type="date"
                    name="data"
                    placeholder="Data"
                    value={novaReceita.data}
                    onChange={handleReceitaChange}
                    className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                />
                <select
                    name="categoria"
                    value={novaReceita.categoria}
                    onChange={handleReceitaChange}
                    className="mb-6 p-4 border border-teal-400 rounded-xl w-full bg-white"
                >
                    <option value="">Selecione uma Categoria</option>
                    {categorias.filter(categoria => categoria.tipo === 'RECEITA').map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-green-500 text-white p-4 rounded-xl w-full border-2 border-transparent transition-colors duration-300 ease-in-out hover:bg-white hover:text-green-500 hover:border-green-500"
                >
                    Adicionar Receita
                </button>            
            </form>
        </div>

        {/* Seção de Despesas */}
        <div className="mb-8">
            <h2 className="text-3xl mb-4 text-red-600">Despesas</h2>
            <Bar data={despesasData} />

            {/* Filtros de Despesas */}
            <div className="mb-8">
                <h3 className="text-3xl mb-6 text-red-600">Filtrar Despesas</h3>
                <select
                    value={filtroSelecionado}
                    onChange={(e) => setFiltroSelecionado(e.target.value)}
                    className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-red-50"
                >
                    <option value="todas">Todas as Despesas</option>
                    <option value="porMes">Por Mês</option>
                    <option value="porPeriodo">Por Período</option>
                    <option value="maiores">Maiores Despesas</option>
                    <option value="menores">Menores Despesas</option>
                </select>

                {/* Inputs dinâmicos para filtros */}
                {filtroSelecionado === 'porMes' && (
                    <div className="flex space-x-6 mb-6">
                        <input
                            type="number"
                            placeholder="Ano"
                            value={filtros.ano}
                            onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                            className="p-4 border border-red-400 rounded-xl bg-red-50"
                        />
                        <input
                            type="number"
                            placeholder="Mês"
                            value={filtros.mes}
                            onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
                            className="p-4 border border-red-400 rounded-xl bg-red-50"
                        />
                    </div>
                )}
                {filtroSelecionado === 'porPeriodo' && (
                    <div className="flex space-x-6 mb-6">
                        <input
                            type="date"
                            placeholder="Data Início"
                            value={filtros.dataInicio}
                            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                            className="p-4 border border-red-400 rounded-xl bg-red-50"
                        />
                        <input
                            type="date"
                            placeholder="Data Fim"
                            value={filtros.dataFim}
                            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                            className="p-4 border border-red-400 rounded-xl bg-red-50"
                        />
                    </div>
                )}
                {(filtroSelecionado === 'maiores' || filtroSelecionado === 'menores') && (
                    <input
                        type="number"
                        placeholder="Limite"
                        value={filtros.limite}
                        onChange={(e) => setFiltros({ ...filtros, limite: e.target.value })}
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-red-50"
                    />
                )}

                <button
                    onClick={aplicarFiltroDespesa}
                    className="bg-red-600 text-white p-4 rounded-xl w-full border-2 border-red-600 transition-colors duration-300 ease-in-out hover:bg-white hover:text-red-600 hover:border-red-600 active:bg-gray-200 active:text-red-700"
                >
                    Aplicar Filtro
                </button>
            </div>

            {/* Tabela de Despesas */}
            <table className="min-w-full bg-white mb-8 rounded-xl shadow-lg">
                <thead>
                    <tr className="bg-red-100">
                        <th className="py-4 px-6">Descrição</th>
                        <th className="py-4 px-6">Valor</th>
                        <th className="py-4 px-6">Data</th>
                        <th className="py-4 px-6">Categoria</th>
                        <th className="py-4 px-6">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {(despesasFiltradas.length > 0 ? despesasFiltradas : despesas).map((despesa) => (
                        <tr key={despesa.id} className="border-t">
                            <td className="py-4 px-6">{despesa.descricao}</td>
                            <td className="py-4 px-6">{despesa.valor}</td>
                            <td className="py-4 px-6">{despesa.data}</td>
                            <td className="py-4 px-6">{despesa.descricaoCategoria ? despesa.descricaoCategoria : 'Sem Categoria'}</td>
                            <td className="py-4 px-6 flex space-x-4">
                                <button
                                    onClick={() => handleDeleteDespesa(despesa.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Excluir
                                </button>
                                <button
                                    onClick={() => handleEditDespesa(despesa)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {despesaEditando && (
                <div className="mb-8 p-6 bg-red-50 rounded-xl shadow-lg">
                    <h3 className="text-3xl mb-6 text-red-600">Editar Despesa</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={despesaEditando.descricao}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, descricao: e.target.value })
                        }
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={despesaEditando.valor}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, valor: e.target.value })
                        }
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={despesaEditando.data}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, data: e.target.value })
                        }
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    />
                    <select
                        name="categoria"
                        value={despesaEditando.categoria}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, categoria: e.target.value })
                        }
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias
                            .filter((categoria) => categoria.tipo === 'DESPESA')
                            .map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                    </select>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSaveDespesa}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl"
                        >
                            Salvar
                        </button>
                        <button
                            onClick={() => setDespesaEditando(null)}
                            className="bg-gray-600 text-white px-6 py-3 rounded-xl"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleDespesaSubmit} className="mb-8 p-6 bg-red-50 rounded-xl shadow-lg">
                <h3 className="text-3xl mb-6 text-red-600">Adicionar Nova Despesa</h3>
                <input
                    type="text"
                    name="descricao"
                    placeholder="Descrição"
                    value={novaDespesa.descricao}
                    onChange={handleDespesaChange}
                    className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                />
                <input
                    type="number"
                    name="valor"
                    placeholder="Valor"
                    value={novaDespesa.valor}
                    onChange={handleDespesaChange}
                    className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                />
                <input
                    type="date"
                    name="data"
                    placeholder="Data"
                    value={novaDespesa.data}
                    onChange={handleDespesaChange}
                    className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                />
                <select
                    name="categoria"
                    value={novaDespesa.categoria}
                    onChange={handleDespesaChange}
                    className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                >
                    <option value="">Selecione uma Categoria</option>
                    {categorias.filter(categoria => categoria.tipo === 'DESPESA').map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-red-500 text-white p-4 rounded-xl w-full border-2 border-transparent transition-colors duration-300 ease-in-out hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                    Adicionar Despesa
                </button>            
            </form>
        </div>

        {/* Seção de Categorias */}
        <div className="mb-8">
            <h2 className="text-3xl mb-4 text-purple-600">Categorias</h2>
            <table className="min-w-full bg-white mb-8 rounded-xl shadow-lg">
                <thead>
                    <tr className="bg-purple-100">
                        <th className="py-4 px-6">Nome</th>
                        <th className="py-4 px-6">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria.id} className="border-t">
                            <td className="py-4 px-6">{categoria.nome}</td>
                            <td className="py-4 px-6">{categoria.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleCategoriaSubmit} className="mb-8 p-6 bg-purple-50 rounded-xl shadow-lg">
                <h3 className="text-3xl mb-6 text-purple-600">Adicionar Nova Categoria</h3>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={novaCategoria.nome}
                    onChange={handleCategoriaChange}
                    className="mb-6 p-4 border border-purple-400 rounded-xl w-full bg-white"
                />
                <select
                    name="tipo"
                    value={novaCategoria.tipo}
                    onChange={handleCategoriaChange}
                    className="mb-6 p-4 border border-purple-400 rounded-xl w-full bg-white"
                >
                    <option value="RECEITA">Receita</option>
                    <option value="DESPESA">Despesa</option>
                </select>
                <button
                    type="submit"
                    className="bg-purple-500 text-white p-4 rounded-xl w-full border-2 border-transparent transition-colors duration-300 ease-in-out hover:bg-white hover:text-purple-500 hover:border-purple-500"
                >
                    Adicionar Categoria
                </button>            
            </form>
        </div>
    </div>
 
    
);

};

export default Dashboard;