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
    comments.push({ id: commentId, content, status: 'pending' })
    commentsByPostId[req.params.id] = comments

    axios.post('http://localhost:3004/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })

    res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
    console.log('Evnet recieved', req.body.type);
    const { type, data } = req.body
    if (type === 'CommentModrated') {
        const { postId, status, id, content } = data
        const comments = commentsByPostId[postId]
        const comment = comments.find((element) => {
            return element.id === id
        })
        comment.status = status
        await axios.post('http://localhost:3004/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        })
    }
    res.send({})
})

app.listen(3001, () => {
    console.log('server running at 3001...');
})