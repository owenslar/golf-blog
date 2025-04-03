import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
// import { v4 as uuidv4 } from 'uuid';

const dynamoDBClient = new DynamoDBClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const dbclient = DynamoDBDocumentClient.from(dynamoDBClient);

const app = express();
    
app.use(bodyParser.json());
app.use(express.json());

// THE ARRAYS BELOW ARE TEMPORARY DATA THAT NEED TO BE STORED IN A DATABASE IN THE FUTURE
// FOR NOW THEY ARE USED TO TEST THE ENDPONITS

const users = [];

let refreshTokens = [];

const blogs = [];

const getBlogs = async () => {
    let allBlogs = [];
    let lastEvaluatedKey = null;

    do {
        const command = new ScanCommand({
            TableName: 'Golf-Blog-Blogs',
            ExclusiveStartKey: lastEvaluatedKey || undefined,
        });

        try {
            const { Items, LastEvaluatedKey } = await dbclient.send(command);
            if (Items && Array.isArray(Items)) {
                allBlogs = allBlogs.concat(Items);
            } else {
                console.error("Items is not an array or is undefined.");
            }
        
            lastEvaluatedKey = LastEvaluatedKey || null;
        } catch (err) {
            throw new Error("error scanning table: " + err.message);
        }
    } while (lastEvaluatedKey);

    return allBlogs;
}

// GET BLOGS
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await getBlogs();
        return res.json(blogs);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// GET SPECIFIC BLOG
app.get('/api/blogs/:id', (req, res) => {
    const id = req.params.id;
    const foundBlog = blogs.find((blog) => blog.id === parseInt(id));
    
    if (!foundBlog) {
        return res.status(404).send({ message: 'Blog not found' });
    }
    return res.send(foundBlog); 
});

// CREATE A BLOG
app.post('/api/blogs', authenticateToken, (req, res) => {
    const blogData = req.body;
    if (!blogData) {
        return res.status(400).json({ error: 'Invalid data recieved' });
    }
    blogData.id = blogs.length + 1;
    blogData.username = req.userData.username;
    blogs.push(blogData);
    return res.sendStatus(200);
});

// DELETE A BLOG
// modify this to actually delete within the DB
app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
    const deleteId = parseInt(req.params.id);
    const userData = req.userData;
    if (!deleteId) {
        return res.status(400).json({ error: 'No ID provided' });
    }
    const index = blogs.findIndex(obj => obj.id === deleteId);
    if (blogs[index].username !== userData.username) {
        return res.status(403).json({ error: 'This blog is not yours' });
    }
    if (index > -1) {
        blogs.splice(index, 1);
    } else {
        return res.send(404).json({ error: 'Blog not found' });
    }
    return res.sendStatus(200);
})

// REFRESH AUTH TOKEN
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
        return res.json({ authToken: authToken });
    });
});

// DELETE REFRESH TOKEN
// MODIFY THIS ENDPOINT TO ACTUALLY DELETE THE REFRESH TOKEN FROM THE DB
app.delete('/api/logout', (req, res) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const userData = extractUserData(token);
        if (userData === null) {
            return res.sendStatus(200);
        }
    
        refreshTokens = refreshTokens.filter(t => {
            const extractedUser = extractUserData(t);
            return extractedUser && extractedUser.username !== userData.username;
        });
    
        return res.sendStatus(204);

    } catch (err) {
        return res.sendStatus(403);
    }
});

function extractUserData(refreshToken) {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}


// REGISTER USER (returns new authtoken and refreshtoken)
app.post('/api/register', (req, res) => {
    const userData = req.body;
    if (!userData) {
        return res.status(400).json({ error: 'Invalid data recieved' });
    }
    if (!userData.username || userData.username === null || userData.username === '') {
        return res.status(400).json({ error: "Bad request, invalid username" });
    }
    if (!userData.password || userData.password === null || userData.password === '') {
        return res.status(400).json({ error: "Bad request, invalid password" });
    }

    // HERE YOU NEED TO CHECK IF THE USER ALREADY EXISTS BEFORE CREATING THEM, AND THE DB SHOULD GENERATE AN ID SOMEHOW
    
    const containsUser = users.some(user => {
        return user.username === userData.username;
    })

    if (containsUser) {
        return res.status(403).json({ error: "Already taken" });
    }

    userData.id = users.length + 1;
    users.push(userData);

    const authToken = generateAuthToken(userData);
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);

    // THIS SHOULD BE REPLACED BY PUTTING THE REFRESH TOKEN IN THE DATABASE
    refreshTokens.push(refreshToken);

    return res.json({ authToken: authToken, refreshToken: refreshToken });
});

// TEMPORARY ENDPOINT FOR TESTING
app.get('/api/test', authenticateToken, (req, res) => {
    return res.json(refreshTokens);
})

// LOGIN USER (returns a new authtoken and refreshtoken)
app.post('/api/login', (req, res) => {
    const reqUserData = req.body;
    
    if (!reqUserData) {
        return res.status(400).json({ error: 'Invalid data recieved' });
    }
    if (!reqUserData.username || reqUserData.username === null || reqUserData.username === '') {
        return res.status(400).json({ error: "Bad request, invalid username" });
    }
    if (!reqUserData.password || reqUserData.password === null || reqUserData.password === '') {
        return res.status(400).json({ error: "Bad request, invalid password" });
    }


    // AUTHENTICATE USER (check their username and password against DB)
    // ALSO FETCH THIS USER DATA FROM THE DATABASE TO USE FOR THE LINES BELOW (should have a username, password, and id)
    const user = users.find(user => user.username === reqUserData.username);
    if (!user) {
        return res.status(403).json({ error: "Unauthorized, user doesn't exist" });
    }
    if (user.password !== reqUserData.password) {
        return res.status(403).json({ error: "Unauthroized, incorrect password"});
    }
    const userData = user;

    const authToken = generateAuthToken(userData);
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);

    // THIS SHOULD BE REPLACED BY PUTTING THE REFRESH TOKEN IN THE DATABASE
    refreshTokens.push(refreshToken);

    return res.json({ authToken: authToken, refreshToken: refreshToken });
});

function generateAuthToken(userData) {
    // EDIT THE 15s TO SOMETHING BIGGER THIS IS JUST FOR TESTING
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
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

// const run = async () => {
//     try {
//         const data = await dbclient.send(new ListTablesCommand({}));
//         console.log("success, table list:", data.TableNames);
//     } catch (err) {
//         console.error("error", err);
//     }
// };
// run();

// const putBlogs = async () => {
//     for (const blog of blogs) {
//         blog.id = uuidv4();
//         try {
//             const command = new PutCommand({
//                 TableName: "Golf-Blog-Blogs",
//                 Item: blog
//             });

//             await dbclient.send(command);
//             console.log(`Successfully inserted: ${JSON.stringify(blog)}`);
//         } catch (error) {
//             console.error("Error inserting item:", error);
//         }
//     }
// }

// putBlogs();
    
const port = process.env.PORT || 8000;
    
app.listen(port, () => {
    console.log('Server listening on port ' + port);
})


export default fromNodeMiddleware(app);
