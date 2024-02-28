const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}; 

app.get('/posts', (req, res) => {
    console.log(posts); 
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { 
            id, title, comments: [] 
        };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        const post = posts[postId]; 
        console.log(post);

        post.comments.push({ id, content }); 
    }
    console.log(posts); 
});

app.listen(3002, () => {
    console.log('Server running at 3002');
});
