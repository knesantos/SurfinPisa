# pizzas.py
from config import db
from flask import abort, make_response, request
from models import Pizza, Person, pizza_schema, person_schema

def read_one(pizza_id):
    pizza = Pizza.query.get(pizza_id)

    if pizza is not None:
        return pizza_schema.dump(pizza)
    else:
        abort(404, f"Pizza with ID {pizza_id} not found")


def update(pizza_id):
    pizza = Pizza.query.get(pizza_id)
    if pizza is None:
        abort(404, description="Pizza not found")

    pizza_data = request.get_json()

    # Validar que los datos de la pizza sean correctos
    if 'content' in pizza_data:
        pizza.content = pizza_data['content']
    if 'person_id' in pizza_data:
        pizza.person_id = pizza_data['person_id']

    db.session.commit()
    return pizza_schema.dump(pizza), 200



def delete(pizza_id):
    existing_pizza = Pizza.query.get(pizza_id)

    if existing_pizza:
        db.session.delete(existing_pizza)
        db.session.commit()
        return make_response(f"{pizza_id} successfully deleted", 204)
    else:
        abort(404, f"Pizza with ID {pizza_id} not found")


def create():
    # Obtener datos JSON del request
    pizza_data = request.get_json()

    # Obtener `lname`, `fname` y `content` del JSON
    lname = pizza_data.get("lname")
    fname = pizza_data.get("fname", "NombreDesconocido")  # Valor por defecto si `fname` no se proporciona
    content = pizza_data.get("pizza", {}).get("content")

    # Verificar si el contenido de la pizza está presente
    if not content:
        abort(400, "El campo 'content' para el tipo de pizza es obligatorio.")

    # Buscar a la persona por `lname` and 'fname'
    person = Person.query.filter(Person.lname == lname).one_or_none()
    
    # Si la persona no existe, crearla
    if person is None:
        person = Person(lname=lname, fname=fname)
        db.session.add(person)
        db.session.commit()  # Guardar a la persona en la base de datos

    # Crear la pizza y asociarla a la persona
    new_pizza = Pizza(content=content, person_id=person.id)
    db.session.add(new_pizza)
    db.session.commit()

    return pizza_schema.dump(new_pizza), 201