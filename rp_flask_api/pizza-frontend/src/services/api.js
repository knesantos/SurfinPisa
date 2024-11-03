// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',  // Cambia la base URL para incluir /api
});

// Funciones de API para personas
export const getPeople = () => api.get('/people').then(response => response.data);
export const getPersonByLastName = (lname) => api.get(`/people/${lname}`).then(response => response.data);
export const createPerson = (data) => api.post('/people', data).then(response => response.data);

// Funciones de API para pizzas
export const getPizzaById = (id) => api.get(`/pizzas/${id}`).then(response => response.data);
export const createPizza = (data) => api.post('/pizzas', data).then(response => response.data);
export const deleteOrder = (id) => api.delete(`/pizzas/${id}/delete`).then(response => response.data);

export default api;