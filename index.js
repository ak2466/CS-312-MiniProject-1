import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Define view engine and views dir
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'))
app.use(express.json());

// Define blog
const blog = {
    title: "My Blog.",
    posts: []
};

// Create id variable (for auto-incrementing)
let id = 0

// Define get route
app.get('/', (req, res) => {
    // Correct way to render the view
    res.render('index.ejs', { blog: blog });
});

// Define post route (post creation)
app.post("/submit-post", (req, res) => {
    const newPost = {
        id: id++,
        author: req.body.author,
        title: req.body.title,
        creationTime: new Date().toLocaleString(),
        content: req.body.content
    };
    blog.posts.push(newPost);
    res.redirect('/');
});

// Define delete route
app.delete("/posts/:id", (req, res) => {
    const postID = parseInt(req.params.id);

    // Get the index in the array of the post we want to delete
    const postIndex = blog.posts.findIndex(post => post.id === postID);

    // Check if post index is a valid value
    if (postIndex === -1) {

        // Return 404 if couldn't find post
        return res.status(404).send('Post not found');
    }

    // Delete the post (splice from array)
    blog.posts.splice(postIndex, 1);

    // Send success
    res.status(200).send('Post successfully deleted.')
})

// Define edit route
app.patch("/posts/:id", (req, res) => {
    const postID = parseInt(req.params.id);
    
    // Get the index in the array of the post we want to delete
    const postIndex = blog.posts.findIndex(post => post.id === postID);

    // Check if post index is a valid value
    if (postIndex === -1) {

        // Return 404 if couldn't find post
        return res.status(404).send('Post not found');
    }

    // Get the post to edit
    const postToEdit = blog.posts[postIndex]

    // Check if title was edited
    if (req.body.title) {
        postToEdit.title = req.body.title;
    }

    // Check if body was edited
    if (req.body.content) {
        postToEdit.content = req.body.content;
    }

    // Send okay status
    res.status(200).json(postToEdit)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});