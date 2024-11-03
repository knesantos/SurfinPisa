// src/components/OrderForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert, Card, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import './OrderForm.css';

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [selectedPizza, setSelectedPizza] = useState('');
    const [personId, setPersonId] = useState(null);
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false); // Controla la ventana de confirmación

    const pizzaOptions = [
        { id: 1, name: "Pizza Mozzarella y Queso" },
        { id: 2, name: "Pizza Cebolla y Queso" },
        { id: 3, name: "Pizza Roquefort" },
        { id: 4, name: "Pizza Pepperoni" },
        { id: 5, name: "Pizza Jamón Crudo y Rúcula" },
        { id: 6, name: "Pizza Cuatro Quesos" },
    ];

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/api/pizzas/${id}`)
                .then(response => {
                    const order = response.data;
                    setSelectedPizza(order.content || '');
                    setPersonId(order.person_id);
                    return axios.get(`http://localhost:8000/api/people/id/${order.person_id}`);
                })
                .then(response => {
                    const person = response.data;
                    setFname(person.fname || '');
                    setLname(person.lname || '');
                })
                .catch(error => console.error("Error al cargar el pedido:", error));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = id ? { content: selectedPizza, person_id: personId } : { fname, lname, pizza: { content: selectedPizza } };

        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/pizzas/${id}/update`, orderData);
                alert("Pedido actualizado exitosamente");
            } else {
                await axios.post('http://localhost:8000/api/pizzas', orderData);
                setIsOrderCreated(true);
                setShowConfirmation(true); // Mostrar ventana de confirmación
            }
        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            alert("Hubo un error al procesar el pedido.");
        }
    };

    const resetForm = () => {
        setSelectedPizza(''); // Limpiar solo el campo de la pizza
        setIsOrderCreated(false);
    };

    const handleContinueOrdering = () => {
        setShowConfirmation(false); // Cerrar la ventana de confirmación
        resetForm(); // Mantiene nombre y apellido, limpia el pedido
    };

    const handleViewOrders = () => {
        setShowConfirmation(false); // Cerrar la ventana de confirmación
        navigate('/pizzas'); // Navega a la lista de pedidos
    };

    return (
        <Container className="order-form-container">
            <NavigationBar />
            <Card className="order-card p-4">
                <h2 className="text-center mb-4">{id ? 'Editar Pedido' : 'Crear Pedido'}</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="fname">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                            placeholder="Ingresa el nombre"
                        />
                    </Form.Group>
                    <Form.Group controlId="lname" className="mt-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            required
                            placeholder="Ingresa el apellido"
                        />
                    </Form.Group>
                    <Form.Group controlId="pizzaSelect" className="mt-3">
                        <Form.Label>Tipo de Pizza</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedPizza}
                            onChange={(e) => setSelectedPizza(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una pizza</option>
                            {pizzaOptions.map((pizza) => (
                                <option key={pizza.id} value={pizza.name}>
                                    {pizza.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-4 w-100 submit-button">
                        {id ? 'Actualizar Pedido' : 'Enviar Pedido'}
                    </Button>
                </Form>
            </Card>

        <Modal
            show={showConfirmation}
            onHide={() => setShowConfirmation(false)}
            centered
            className="custom-modal"
        >       
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">🎉 Pedido Creado 🎉</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="modal-message">¿Quieres hacer otro pedido o prefieres ver los pedidos actuales?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="continue-button" onClick={handleContinueOrdering}>
                    Seguir Pidiendo
                </Button>
                <Button variant="primary" className="view-orders-button" onClick={handleViewOrders}>
                    Ver Pedidos
                </Button>
            </Modal.Footer>
        </Modal>
        </Container>
    );
};

export default OrderForm;
