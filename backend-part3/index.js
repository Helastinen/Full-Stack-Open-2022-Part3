const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()
const Person = require("./models/person")

const app = express()

//* Initial data //
/*let persons = [
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
]*/

//* Middlewares //
app.use(express.json()) // handle json POST requests
app.use(cors()) // allows FE localhost:3000 to connect to BE localhost:3001
app.use(express.static("build")) // BE will show build directory (where FE code is located) as static content

// request logger
morgan.token("reqBody", function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"), "-",
    tokens["response-time"](req, res), "ms -",
    "req body:",
    tokens.reqBody(req, res),
  ].join(" ")
}))

//* Routes //
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/info", (request, response, next) => {
  const date = new Date()

  Person
    .find().estimatedDocumentCount()
    .then(count => {
      response.send(`Phonebook has info for ${count} people.<br/>
      ${date}`)
    })
    .catch(error => next(error))
})

app.get("/api/persons", (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  Person
    .findOne({ name: body.name })
    .then(nameAlreadyExists => {
      if (nameAlreadyExists) {
        return response.status(400).json({ error: "Name needs to be unique" })
      } else {
        person
          .save()
          .then(newPerson => response.json(newPerson))
          .catch(error => next(error))
      }
    })
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  Person
    .findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// * Middleware if unknown route (any other then above ones) is called, DO NOT MOVE //
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" })
}

app.use(unknownEndpoint)

// * Middleware for error handling, DO NOT MOVE //
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if ( error.name === "CastError" ) {
    return response.status(400).send({ error: "malformed id" })
  } else if ( error.name=== "ValidationError" ) {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// * Port mapping //
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})