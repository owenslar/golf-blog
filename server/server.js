
import express from 'express';
import bodyParser from 'body-parser';
    
const app = express();
    
app.use(bodyParser.json());
app.use(express.json());
const blogs = [{ 
    id: 1,
    username: 'testUser',
    name: 'My Name',
    course: 'Brown Deer Golf Club',
    scores: [3, 4, 6, 5, 2, 4, 5, 3, 6, 7, 4, 3, 2, 3, 3, 4, 5, 4],
    description: 'I had a good round today',
    
},
{
    id: 2,
    username: 'owenlarson2',
    name: 'Owen Larson',
    course: 'Finkbine Golf Course',
    scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
    description: 'Played 9 at fink',
},
{
    id: 3,
    username: 'owenlarson3',
    name: 'Owen Larson',
    course: 'Finkbine Golf Course',
    scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
    description: 'Played 9 at fink',
},
{
    id: 4,
    username: 'owenlarson4',
    name: 'Owen Larson',
    course: 'Finkbine Golf Course',
    scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
    description: 'Played 9 at fink',
},
{
    id: 5,
    username: 'owenlarson5',
    name: 'Owen Larson',
    course: 'Finkbine Golf Course',
    scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
    description: 'Played 9 at fink',
}]
    
app.get('/api/blogs', (req, res) => {
    res.send(blogs);
});

app.get('/api/blogs/:id', (req, res) => {
    const id = req.params.id;
    const foundBlog = blogs.find((blog) => blog.id === parseInt(id));
    
    if (!foundBlog) {
        return res.status(404).send({ message: 'Blog not found' });
    }
    res.send(foundBlog); 
});

app.post('/api/blogs', (req, res) => {
    const blogData = req.body;
    if (!blogData) {
        res.status(400).json({ error: 'Invalid data recieved' });
    }
    blogData.id = blogs.length + 1;
    blogData.username = 'TESTING USERNAME';
    blogs.push(blogData);
    res.sendStatus(200);
});
    
const port = process.env.PORT || 8000;
    
app.listen(port, () => {
    console.log('Server listening on port ' + port);
})


export default fromNodeMiddleware(app);
