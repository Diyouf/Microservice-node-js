const express = require('express')
const axios = require('axios')
const bodyParse = require('body-parser')
const app = express()

app.use(bodyParse.json())

const events = []

app.post('/events', (req, res) => {
    const event = req.body
    events.push(event)

    axios.post('http://localhost:3000/events', event)
    axios.post('http://localhost:3001/events', event)
    axios.post('http://localhost:3002/events', event)
    axios.post('http://localhost:3003/events', event)

    res.send({ status: 'ok' })

})

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(3004, () => {
    console.log('server running at 3004')
})