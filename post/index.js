const express = require('express')
const { randomBytes } = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()


app.use(bodyParser.json())
app.use(cors())

const post = {}

app.get('/posts', (req, res) => {
    res.send(post)
})

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex')
    let { title } = req.body

    post[id] = {
        id,
        title
    }

    axios.post('http://localhost:3003/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    })
    res.status(201).json(post)
})



app.post('/events', (req, res) => {
    console.log('Event recived ', req.body.type)
    res.send({})
})

app.listen(3000, () => {
    console.log('server running 3000..')
})