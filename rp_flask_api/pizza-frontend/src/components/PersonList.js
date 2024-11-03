// src/components/PersonList.js
import React, { useEffect, useState } from 'react';
import { getPeople } from '../services/api';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';

const PersonList = () => {
    const [people, setPeople] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getPeople().then(data => setPeople(data)).catch(console.error);
    }, []);

    return (
        <Container className="container-main mt-4">
            <NavigationBar />

            <h2 className="text-center mb-4">Nuestros Clientes</h2>
            <Row>
                {people.map(person => (
                    <Col key={person.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{person.fname} {person.lname}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">ID: {person.id}</Card.Subtitle>
                                <Card.Text as="div">
                                        <strong>Pizzas Pedidas:</strong>
                                        <ul className="mt-2">
                                            {person.pizzas.map(pizza => (
                                                <li key={pizza.id}>🍕 {pizza.content}</li>
                                            ))}
                                        </ul>
                                 </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PersonList;