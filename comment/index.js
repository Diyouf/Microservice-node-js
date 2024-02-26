const express = require('express')
const { randomBytes } = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()

app.use(bodyParser.json())
app.use(cors())


const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body
    const comments = commentsByPostId[req.params.id] || []
    comments.push({ id: commentId, content })
    commentsByPostId[req.params.id] = comments

    axios.post('http://localhost:3004/events',{
        type:'commentCreated',
        data :{
            id : commentId,
            content ,
            postId : req.params.id 
        }
    })

    res.status(201).send(comments)
})

app.listen(3001, () => {
    console.log('server running at 3001...');
})