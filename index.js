const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());

const info = () => {
  const date = new Date();
  return `<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  </div>`;
};

const generateId = () => {
  return Math.floor(Math.random() * 1000000000);
};

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(info());
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  console.log(request?.body);
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'contact name or number missing',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  if (persons.find((p) => p.name === person.name)) {
    return response.status(409).json({ error: 'name must be unique' });
  }

  persons = persons.concat(person);
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
