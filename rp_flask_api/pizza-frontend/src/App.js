// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PersonList from './components/PersonList'; // Componente para lista de personas
import PizzaList from './components/PizzaList';    // Componente para lista de pizzas
import OrderForm from './components/OrderForm.js';    // Componente para crear pedidos

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/persons" element={<PersonList />} />
                <Route path="/pizzas" element={<PizzaList />} />
                <Route path="/create-order" element={<OrderForm />} />
                <Route path="/create-order/:id?" element={<OrderForm />} />
            </Routes>
        </Router>
    );
}

export default App;