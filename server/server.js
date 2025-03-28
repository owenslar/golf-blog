import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

    
const app = express();
    
app.use(bodyParser.json());
app.use(express.json());

// THE ARRAYS BELOW ARE TEMPORARY DATA THAT NEED TO BE STORED IN A DATABASE IN THE FUTURE
// FOR NOW THEY ARE USED TO TEST THE ENDPONITS

const users = [];

let refreshTokens = [];

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

app.post('/api/blogs', authenticateToken, (req, res) => {
    const blogData = req.body;
    if (!blogData) {
        res.status(400).json({ error: 'Invalid data recieved' });
    }
    blogData.id = blogs.length + 1;
    blogData.username = 'TESTING USERNAME';
    blogs.push(blogData);
    res.sendStatus(200);
});

app.post('/api/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
        if (err) {
            return res.sendStatus(403);
        }
        const authToken = generateAuthToken({ id: userData.id, username: userData.username, password: userData.password })
        res.json({ authToken: authToken });
    });
});

// MODIFY THIS ENDPOINT TO ACTUALLY DELETE THE REFRESH TOKEN FROM THE DB
app.delete('/api/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.post('/api/register', (req, res) => {
    const userData = req.body;
    if (!userData) {
        res.status(400).json({ error: 'Invalid data recieved' });
    }
    if (!userData.username || userData.username === null || userData.username === '') {
        res.status(400).json({ error: "Bad request, invalid username" });
    }
    if (!userData.password || userData.password === null || userData.password === '') {
        res.status(400).json({ error: "Bad request, invalid password" });
    }

    // HERE YOU NEED TO CHECK IF THE USER ALREADY EXISTS BEFORE CREATING THEM, AND THE DB SHOULD GENERATE AN ID SOMEHOW
    
    const containsUser = users.some(user => {
        return user.username === userData.username;
    })

    if (containsUser) {
        res.status(403).json({ error: "Already taken" });
    }

    userData.id = users.length + 1;
    users.push(userData);

    const authToken = generateAuthToken(userData);
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);

    // THIS SHOULD BE REPLACED BY PUTTING THE REFRESH TOKEN IN THE DATABASE
    refreshTokens.push(refreshToken);

    res.json({ authToken: authToken, refreshToken: refreshToken });
});

// TEMPORARY ENDPOINT FOR TESTING
app.get('/api/test', authenticateToken, (req, res) => {
    req.userData.message = "Logged in!";
    res.json(req.userData);
})

app.post('/api/login', (req, res) => {
    const reqUserData = req.body;
    
    if (!reqUserData) {
        res.status(400).json({ error: 'Invalid data recieved' });
    }
    if (!reqUserData.username || reqUserData.username === null || reqUserData.username === '') {
        res.status(400).json({ error: "Bad request, invalid username" });
    }
    if (!reqUserData.password || reqUserData.password === null || reqUserData.password === '') {
        res.status(400).json({ error: "Bad request, invalid password" });
    }


    // AUTHENTICATE USER (check their username and password against DB)
    // ALSO FETCH THIS USER DATA FROM THE DATABASE TO USE FOR THE LINES BELOW (should have a username, password, and id)
    const user = users.find(user => user.username === reqUserData.username);
    if (!user) {
        res.status(403).json({ error: "Unauthorized, user doesn't exist" });
    }
    if (user.password !== reqUserData.password) {
        res.status(403).json({ error: "Unauthroized, incorrect password"});
    }
    const userData = user;

    const authToken = generateAuthToken(userData);
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);

    // THIS SHOULD BE REPLACED BY PUTTING THE REFRESH TOKEN IN THE DATABASE
    refreshTokens.push(refreshToken);

    res.json({ authToken: authToken, refreshToken: refreshToken });
});

function generateAuthToken(userData) {
    // EDIT THE 15s TO SOMETHING BIGGER THIS IS JUST FOR TESTING
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.userData = userData;
        next();
    })
}
    
const port = process.env.PORT || 8000;
    
app.listen(port, () => {
    console.log('Server listening on port ' + port);
})


export default fromNodeMiddleware(app);
