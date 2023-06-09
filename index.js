const express = require("express")
const morgan = require('morgan')
const app = express()
app.use(express.json())
morgan.token('data', (request, response) => {
    const body = request.body
    return JSON.stringify({
        name: body.name,
        number: body.number
    })
})
app.use(morgan('tiny'))

let persons= [
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
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    response.setHeader("Content", "plain");
    response.write(`Phonebook has info for ${persons.length} people`)
    date = new Date()
    response.write(`\n${date}`)
    response.end()
})
app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
app.use(morgan(':data'))
app.post('/api/persons', (request, response) => {
    const body = request.body
    const nameExists = persons.some(p => p.name === body.name)
    if(!body.name){
        return response.status(400).json({error: 'name missing'})
    }
    if(!body.number){
        return response.status(400).json({error: 'number missing'})
    }
    if(nameExists){
        return response.status(400).json({error:'name must be unique'})
    }
    const person = {
        id: Math.random(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})