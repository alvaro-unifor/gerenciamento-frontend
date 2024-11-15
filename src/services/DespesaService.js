const API_URL = 'http://localhost:8080';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const listarDespesas = async (token, userId) => {
    try {
        const response = await fetch(`${API_URL}/listar-despesas?usuarioId=${userId}`, {
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

export const criarDespesa = async (despesa, token) => {
    try {
        const userId = localStorage.getItem('id');
        const despesaComUsuario = { ...despesa, usuario: userId };

        const response = await fetch(`${API_URL}/criar-despesa`, {
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

export const atualizarDespesa = async (id, despesa, token) => {
    try {
        const response = await fetch(`${API_URL}/atualizar-despesa/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(despesa)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const deletarDespesa = async (id, token) => {
    try {
        const response = await fetch(`${API_URL}/deletar-despesa/${id}`, {
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