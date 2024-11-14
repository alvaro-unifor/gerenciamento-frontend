// src/services/CategoriaService.js
const API_URL = 'http://localhost:8080';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const listarCategorias = async (token) => {
    try {
        const response = await fetch(`${API_URL}/listar-categorias`, {
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

export const cadastrarCategoria = async (categoria, token) => {
    try {
        const response = await fetch(`${API_URL}/cadastrar-categoria`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(categoria)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};