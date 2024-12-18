const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example in-memory storage for users and posts
let users = [];
let posts = [];

// Route to register a new user
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.status(201).send({ message: "User registered successfully!" });
});

// Route for user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.status(200).send({ message: "Login successful!" });
    } else {
        res.status(401).send({ message: "Invalid credentials." });
    }
});

// Route to create a new post
app.post('/api/posts', (req, res) => {
    const { title, content, username } = req.body;
    const post = { title, content, username, votes: 0, comments: [] };
    posts.push(post);
    res.status(201).send({ message: "Post created successfully!" });
});

// Route to get all posts
app.get('/api/posts', (req, res) => {
    res.status(200).send(posts);
});

// Route to upvote a post
app.post('/api/posts/:title/upvote', (req, res) => {
    const { title } = req.params;
    const post = posts.find(p => p.title === title);
    if (post) {
        post.votes += 1;
        res.status(200).send({ message: "Post upvoted!", votes: post.votes });
    } else {
        res.status(404).send({ message: "Post not found." });
    }
});

// Route to downvote a post
app.post('/api/posts/:title/downvote', (req, res) => {
    const { title } = req.params;
    const post = posts.find(p => p.title === title);
    if (post) {
        post.votes -= 1;
        res.status(200).send({ message: "Post downvoted!", votes: post.votes });
    } else {
        res.status(404).send({ message: "Post not found." });
    }
});

// Route to add a comment to a post
app.post('/api/posts/:title/comments', (req, res) => {
    const { title } = req.params;
    const { comment } = req.body;
    const post = posts.find(p => p.title === title);
    if (post) {
        post.comments.push(comment);
        res.status(201).send({ message: "Comment added!", comments: post.comments });
    } else {
        res.status(404).send({ message: "Post not found." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
