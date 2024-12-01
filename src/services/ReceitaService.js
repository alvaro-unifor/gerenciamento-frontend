const API_URL = 'http://localhost:8080';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const criarReceita = async (receita, token) => {
    try {
        const userId = localStorage.getItem('id');
        const despesaComUsuario = { ...receita, usuario: userId };

        const response = await fetch(`${API_URL}/criar-receita`,  {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(despesaComUsuario)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const atualizarReceita = async (id, receita, token) => {
    try {
        const response = await fetch(`${API_URL}/atualizar-receita/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(receita)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const deletarReceita = async (id, token) => {
    try {
        const response = await fetch(`${API_URL}/deletar-receita/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarReceitas = async (token, userId) => {
    try {
        const response = await fetch(`${API_URL}/listar-receitas?usuarioId=${userId}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};
export const listarReceitasPorMes = async (ano, mes, token) => {
    try {
        const response = await fetch(`${API_URL}/receitas/mes/${ano}/${mes}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarReceitasPorPeriodo = async (dataInicio, dataFim, token) => {
    try {
        const response = await fetch(`${API_URL}/receitas/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarMaioresReceitas = async (limite, token) => {
    try {
        const response = await fetch(`${API_URL}/receitas/maiores?limite=${limite}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarMenoresReceitas = async (limite, token) => {
    try {
        const response = await fetch(`${API_URL}/receitas/menores?limite=${limite}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};