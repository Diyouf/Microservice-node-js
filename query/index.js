const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {

    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = {
            id, title, comments: []
        };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        console.log(post);

        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data
        const post = posts[postId]
        const comment = post.comments.find((element) => {
            return element.id === id
        })
        comment.status = status
        comment.content = content

    }
}

app.get('/posts', (req, res) => {
    console.log(posts);
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvents(type, data)
    res.send({})
});

app.listen(3002, async () => {
    console.log('Server running at 3002')
    
    const res = await axios.get('http://localhost:3004/events')
    console.log(res)
    for (let items of res.data) {
        console.log('Prossesing Events:', items.type)
        handleEvents(items.type, items.data)
    }
});
