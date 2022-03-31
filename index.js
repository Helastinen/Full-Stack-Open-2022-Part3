const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// to handle json POST requests
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const date = new Date()

  response.send(
    `Phonebook has info for ${persons.length} people.<br/>
    ${date}`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  const randomId = Math.floor(Math.random() * 10000)
  const nameAlreadyExists = persons.some(person => 
    person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing"
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "number is missing"
    })
  } else if (nameAlreadyExists) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: randomId,
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})