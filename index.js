const express = require('express')
const morgan = require('morgan') // Import the morgan package
const app = express()
const cors = require('cors')

app.use(express.static('build'))

app.use(cors())

// Define a custom token for morgan to log request body data
morgan.token('postData', (req, res) => JSON.stringify(req.body))

// Use morgan middleware for logging with the 'tiny' configuration
// and the custom token for logging request body data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Queenie Ezenwa",
    "number": "1774055012",
    "id": 5
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentTime = new Date()
  const personCount = persons.length
  
  const infoHtml = `
    <div>
      <p>Phonebook has info of ${personCount} People</p>
      <p> ${currentTime}</p>
    </div>
  `
  
  response.send(infoHtml)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person =>  person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log("Delete Successful!")
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number missing' 
    })
  }  

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
