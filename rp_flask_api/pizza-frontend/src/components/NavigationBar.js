// src/components/NavigationBar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    // Maneja el evento de scroll para mostrar/ocultar la barra de navegación
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) { // Muestra la barra después de 100px de desplazamiento
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Limpia el evento cuando el componente se desmonte
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`navigation-bar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="nav-logo">
                <img src={`${process.env.PUBLIC_URL}/pizza-navbar.png`} alt="Pizza Logo" className="logo-image" />
            </div>
            <div className="nav-buttons">
                <button className="nav-button" onClick={() => navigate('/')}>
                    🏠 Inicio
                </button>
                <button className="nav-button" onClick={() => navigate('/pizzas')}>
                    🍕 Estado de los Pedidos
                </button>
                <button className="nav-button" onClick={() => navigate('/persons')}>
                    👥 Consulta de Personas
                </button>
                <button className="nav-button" onClick={() => navigate('/create-order')}>
                    📝 Crear Pedido
                </button>
            </div>
        </div>
    );
};

export default NavigationBar;