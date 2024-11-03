// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container className="homepage-container">
            <h1 className="homepage-title">Surfing Pizza</h1>
            <img src="/pizza.png" alt="Pizza girando" className="pizza-spin" />
            <p className="homepage-description">¡Bienvenido a Surfing Pizza! Elige una opción y disfruta de la mejor pizza.</p>
            <div className="button-group">
                <Button className="homepage-button button-outline-primary" onClick={() => navigate('/persons')}>
                    👥 Nuestros Amados Clientes
                </Button>
                <Button className="homepage-button button-primary" onClick={() => navigate('/create-order')}>
                    📝 Crear Pedido
                </Button>
                <Button className="homepage-button button-secondary" onClick={() => navigate('/pizzas')}>
                    🍕 Estado de los Pedidos
                </Button>
            </div>
        </Container>
    );
};

export default HomePage;
