require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()

//* Initial data //
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

//* Middlewares //
app.use(express.json()) // handle json POST requests
app.use(cors()) // allows FE localhost:3000 to connect to BE localhost:3001
app.use(express.static("build")) // BE will show build directory (where FE code is located) as static content

// request logger
morgan.token("postBody", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms -',
    "body:",
    tokens.postBody(req, res),
  ].join(" ")
}))

//* Routes //
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get("/info", (request, response) => {
  const date = new Date()

  response.send(
    `Phonebook has info for ${persons.length} people.<br/>
    ${date}`
  )
})

app.get("/api/persons", (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => response.json(savedPerson))
})

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  let person = persons.find(person => person.id === id)
  const body = request.body
  const updatedPerson = { ...person, number: body.number }

  persons = persons.map(person => 
    person.id !== id
      ? person
      : updatedPerson)
  
  console.log("updated person:", updatedPerson);
  response.json(updatedPerson)
})

app.delete("/api/persons/:id", (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

// * Middleware if not route is called //
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" })
}

app.use(unknownEndpoint)

// * Port mapping //
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})