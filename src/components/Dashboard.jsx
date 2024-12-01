import React, { useEffect, useState } from 'react';
import { listarReceitas, criarReceita , deletarReceita, atualizarReceita, listarMaioresReceitas,listarMenoresReceitas,listarReceitasPorMes,listarReceitasPorPeriodo} from '../services/ReceitaService';
import { listarDespesas, criarDespesa, deletarDespesa, atualizarDespesa} from '../services/DespesaService';
import { listarCategorias, cadastrarCategoria } from '../services/CategoriaService';

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
    
    const aplicarFiltro = async () => {
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
    
    
    
    
  


    
return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-3xl mb-6">Gerenciamento AI</h1>

        
        

        {/* Seção de Receitas */}
        <div className="mb-6">
    <h2 className="text-2xl mb-2">Receitas</h2>

    {/* Filtros de Receitas */}
    <div className="mb-4">
        <h3 className="text-xl mb-2">Filtrar Receitas</h3>
        <select
            value={filtroSelecionado}
            onChange={(e) => setFiltroSelecionado(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded w-full"
        >
            <option value="todas">Todas as Receitas</option>
            <option value="porMes">Por Mês</option>
            <option value="porPeriodo">Por Período</option>
            <option value="maiores">Maiores Receitas</option>
            <option value="menores">Menores Receitas</option>
        </select>

        {/* Inputs dinâmicos para filtros */}
        {filtroSelecionado === 'porMes' && (
            <div className="flex space-x-2 mb-2">
                <input
                    type="number"
                    placeholder="Ano"
                    value={filtros.ano}
                    onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    placeholder="Mês"
                    value={filtros.mes}
                    onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>
        )}
        {filtroSelecionado === 'porPeriodo' && (
            <div className="flex space-x-2 mb-2">
                <input
                    type="date"
                    placeholder="Data Início"
                    value={filtros.dataInicio}
                    onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    placeholder="Data Fim"
                    value={filtros.dataFim}
                    onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>
        )}
        {(filtroSelecionado === 'maiores' || filtroSelecionado === 'menores') && (
            <input
                type="number"
                placeholder="Limite"
                value={filtros.limite}
                onChange={(e) => setFiltros({ ...filtros, limite: e.target.value })}
                className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
        )}

        <button
            onClick={aplicarFiltro}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Aplicar Filtro
        </button>
    </div>

    {/* Tabela de Receitas */}
    <table className="min-w-full bg-white mb-4">
        <thead>
            <tr>
                <th className="py-2">Descrição</th>
                <th className="py-2">Valor</th>
                <th className="py-2">Data</th>
                <th className="py-2">Categoria</th>
                <th className="py-2">Ações</th>
            </tr>
        </thead>
        <tbody>
            {(receitasFiltradas.length > 0 ? receitasFiltradas : receitas).map((receita) => (
                <tr key={receita.id}>
                    <td className="border px-4 py-2">{receita.descricao}</td>
                    <td className="border px-4 py-2">{receita.valor}</td>
                    <td className="border px-4 py-2">{receita.data}</td>
                    <td className="border px-4 py-2">{receita.descricaoCategoria ? receita.descricaoCategoria : 'Sem Categoria'}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                        <button
                            onClick={() => handleDeleteReceita(receita.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Excluir
                        </button>
                        <button
                            onClick={() => handleEditReceita(receita)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Editar
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    {receitaEditando && (
        <div className="mb-4">
            <h3 className="text-xl mb-2">Editar Receita</h3>
            <input
                type="text"
                name="descricao"
                placeholder="Descrição"
                value={receitaEditando.descricao}
                onChange={(e) =>
                    setReceitaEditando({ ...receitaEditando, descricao: e.target.value })
                }
                className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
                type="number"
                name="valor"
                placeholder="Valor"
                value={receitaEditando.valor}
                onChange={(e) =>
                    setReceitaEditando({ ...receitaEditando, valor: e.target.value })
                }
                className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
                type="date"
                name="data"
                placeholder="Data"
                value={receitaEditando.data}
                onChange={(e) =>
                    setReceitaEditando({ ...receitaEditando, data: e.target.value })
                }
                className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <select
                name="categoria"
                value={receitaEditando.categoria}
                onChange={(e) =>
                    setReceitaEditando({ ...receitaEditando, categoria: e.target.value })
                }
                className="mb-2 p-2 border border-gray-300 rounded w-full"
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
            <div className="flex space-x-2">
                <button
                    onClick={handleSaveReceita}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Salvar
                </button>
                <button
                    onClick={() => setReceitaEditando(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )}

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

        {/* Seção de Despesas */}
        <div className="mb-6">
            <h2 className="text-2xl mb-2">Despesas</h2>
            <table className="min-w-full bg-white mb-4">
                <thead>
                    <tr>
                        <th className="py-2">Descrição</th>
                        <th className="py-2">Valor</th>
                        <th className="py-2">Data</th>
                        <th className="py-2">Categoria</th>
                        <th className="py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {despesas.map((despesa) => (
                        <tr key={despesa.id}>
                            <td className="border px-4 py-2">{despesa.descricao}</td>
                            <td className="border px-4 py-2">{despesa.valor}</td>
                            <td className="border px-4 py-2">{despesa.data}</td>
                            <td className="border px-4 py-2">{despesa.descricaoCategoria ? despesa.descricaoCategoria : 'Sem Categoria'}</td>
                            <td className="border px-4 py-2 flex space-x-2">
                                <button
                                    onClick={() => handleDeleteDespesa(despesa.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Excluir
                                </button>
                                <button
                                    onClick={() => handleEditDespesa(despesa)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Editar
                                </button>
                            </td>
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

            {/* Formulário de edição de despesas */}
            {despesaEditando && (
                <div className="mb-4">
                    <h3 className="text-xl mb-2">Editar Despesa</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={despesaEditando.descricao}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, descricao: e.target.value })
                        }
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={despesaEditando.valor}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, valor: e.target.value })
                        }
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={despesaEditando.data}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, data: e.target.value })
                        }
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        name="categoria"
                        value={despesaEditando.categoria}
                        onChange={(e) =>
                            setDespesaEditando({ ...despesaEditando, categoria: e.target.value })
                        }
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
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
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSaveDespesa}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Salvar
                        </button>
                        <button
                            onClick={() => setDespesaEditando(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
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