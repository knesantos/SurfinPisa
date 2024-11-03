// src/components/PizzaList.js
// src/components/PizzaList.js
import React, { useEffect, useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { getPeople, deleteOrder } from '../services/api'; // Asegúrate de tener deleteOrder en tu API
import { useNavigate } from 'react-router-dom';
import './PizzaList.css';
import NavigationBar from './NavigationBar';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Iconos para editar y eliminar

const PizzaList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        getPeople().then(data => {
            const initialOrders = data.flatMap(person =>
                person.pizzas.map(pizza => {
                    const originalTime = new Date(pizza.timestamp);
                    const adjustedTime = new Date(originalTime.getTime() - 3 * 60 * 60 * 1000); 
                    
                    return {
                        id: pizza.id,
                        personName: `${person.fname} ${person.lname}`,
                        pizzaType: pizza.content,
                        orderTime: adjustedTime
                    };
                })
            );

            initialOrders.sort((a, b) => b.orderTime - a.orderTime);
            
            setOrders(initialOrders);
        }).catch(console.error);
    };

    const handleDelete = async (orderId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
            await deleteOrder(orderId);
            fetchOrders(); 
        }
    };

    const handleEdit = (orderId) => {
        navigate(`/create-order/${orderId}`);
    };

    const getOrderStatus = (orderTime) => {
        const now = new Date();
        const timeElapsed = Math.floor((now - orderTime) / 60000);

        if (timeElapsed < 1) return { text: "🍕 Pedido llegando a la pizzería", style: "status-arriving" };
        if (timeElapsed < 2) return { text: "👨‍🍳 Pedido en preparación", style: "status-preparing" };
        if (timeElapsed < 3) return { text: "🔥 Pedido en el horno", style: "status-baking" };
        if (timeElapsed < 5) return { text: "🚚 Pedido en camino", style: "status-onway" };
        return { text: "🏠 Entregado", style: "status-delivered" };
    };

    const formatTime = (date) => {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleString('es-ES', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculateEstimatedTime = (orderTime) => {
        const estimatedTime = new Date(orderTime.getTime() + 5 * 60000);
        return formatTime(estimatedTime);
    };

    return (
        <Container className="container-main mt-4">
           <NavigationBar />

            <h2 className="text-center mb-4">Estado de los Pedidos</h2>
            <Table className="table-orders" striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Persona</th>
                        <th>Pizza</th>
                        <th>Hora del Pedido</th>
                        <th>Hora Estimada de Entrega</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.personName}</td>
                            <td>{order.pizzaType}</td>
                            <td>{formatTime(order.orderTime)}</td>
                            <td>{calculateEstimatedTime(order.orderTime)}</td>
                            <td className={`status-cell ${getOrderStatus(order.orderTime).style}`}>
                                {getOrderStatus(order.orderTime).text}
                            </td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(order.id)} className="me-2">
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(order.id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default PizzaList;
