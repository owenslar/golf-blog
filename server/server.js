import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

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

const getBlog = async (partitionKey) => {
    try {
        const command = new GetCommand({
            TableName: "Golf-Blog-Blogs",
            Key: {
                id: partitionKey,
            },
        });

        const { Item } = await dbclient.send(command);

        if (Item) {
            console.log("Item retrieved");
            return Item;
        } else {
            console.log("Item not found");
            return null;
        }
    } catch (error) {
        throw new Error("error retrieving blog: " + error.message);
    }
}

// GET SPECIFIC BLOG
app.get('/api/blogs/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const foundBlog = await getBlog(id);

        if (!foundBlog) {
            return res.status(404).send({ message: 'Blog not found' });
        }
        return res.json(foundBlog);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    
});

const addBlog = async (blogData) => {
    try {
        const command = new PutCommand({
            TableName: "Golf-Blog-Blogs",
            Item: blogData,
        });

        await dbclient.send(command);
        console.log(`Successfully inserted blog: ${JSON.stringify(blogData)}`);
    } catch (error) {
        console.log("ERROR ADDING BLOG");
        throw new Error("Error adding blog: " + error.message);
    }
}

// CREATE A BLOG
app.post('/api/blogs', authenticateToken, async (req, res) => {
    const blogData = req.body;
    if (!blogData) {
        return res.status(400).json({ error: 'Invalid data recieved' });
    }
    blogData.id = uuidv4();
    blogData.username = req.userData.username;
    try {
        await addBlog(blogData);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const deleteBlog = async (blogId) => {
    try {
        const command = new DeleteCommand({
            TableName: "Golf-Blog-Blogs",
            Key: {
                id: blogId,
            }
        });

        await dbclient.send(command);

    } catch (error) {
        throw new Error("Error deleting blog: " + error.message);
    }
}

// DELETE A BLOG
// modify this to actually delete within the DB
app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
    const deleteId = req.params.id;
    const userData = req.userData;
    if (!deleteId) {
        return res.status(400).json({ error: 'No ID provided' });
    }
    const blog = await getBlog(deleteId);
    if (!blog) {
        return res.status(400).json({ error: "blog not found" });
    }
    if (blog.username !== userData.username) {
        return res.status(403).json({ error: 'This blog is not yours' });
    }
    
    try {
        await deleteBlog(deleteId);
        console.log(`Successfully deleted blog: ${JSON.stringify(blog)}`);
    } catch (error) {
        console.log("error deleting blog");
        return res.status(500).json({ error: error.message });
    }

    return res.sendStatus(200);
})

const queryRefreshToken = async (refreshToken) => {
    try {
        const command = new QueryCommand({
            TableName: "Golf-Blog-RefreshTokens",
            IndexName: "RefreshTokenIndex",
            KeyConditionExpression: "refreshToken = :refreshToken",
            ExpressionAttributeValues: {
                ":refreshToken": refreshToken
            }
        });

        const { Items } = await dbclient.send(command);
        return Items;
    } catch (error) {
        throw new Error("Error querying RefreshToken: " + error.message);
    }
}

// REFRESH AUTH TOKEN
app.post('/api/token', async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.status(401).json({ error: "Missing or invalid refresh token" });
    }
    
    try {
        const tokens = await queryRefreshToken(refreshToken);
        
        if (tokens.length === 0) {
            return res.status(403).json({ error: "Unauthorized, please log in again" });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
            if (err) {
                return res.sendStatus(403);
            }
            const authToken = generateAuthToken({ username: userData.username, password: userData.password });
            return res.json({ authToken: authToken });
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const deleteRefreshTokens = async (username) => {
    try {
        const command = new QueryCommand({
            TableName: "Golf-Blog-RefreshTokens",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            }
        });

        const { Items } = await dbclient.send(command);

        if (Items.length === 0) {
            return { message: "No refresh tokens found for user." };
        }

        for (let item of Items) {
            const deleteCommand = new DeleteCommand({
                TableName: "Golf-Blog-RefreshTokens",
                Key: {
                    username: item.username,
                    refreshToken: item.refreshToken,
                }
            });

            await dbclient.send(deleteCommand);
        }

        return { message: "All refresh tokens deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting refresh tokens: " + error.message);
    }
}

// DELETE REFRESH TOKENS
app.delete('/api/logout', async (req, res) => {
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
    
        const response = await deleteRefreshTokens(userData.username);
        console.log(response);
    
        return res.sendStatus(204);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

function extractUserData(refreshToken) {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

const getUser = async (username) => {
    try {
        const command = new GetCommand({
            TableName: "Golf-Blog-Users",
            Key: {
                username: username,
            },
        });

        return await dbclient.send(command);
    } catch (error) {
        throw new Error("Error retrieving user: " + error.message);
    }
}

const addUser = async (userData) => {
    try {

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const command = new PutCommand({
            TableName: "Golf-Blog-Users",
            Item: userData,
        });

        await dbclient.send(command);
    } catch (error) {
        throw new Error("Error adding user: " + error.message);
    }
}

const addRefreshToken = async (username, refreshToken) => {
    try {
        const command = new PutCommand({
            TableName: "Golf-Blog-RefreshTokens",
            Item: { username: username, refreshToken: refreshToken },
        });

        await dbclient.send(command);
    } catch (error) {
        throw new Error("Error adding refreshToken: " + error.message);
    }
}

const checkPassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
}


// REGISTER USER (returns new authtoken and refreshtoken)
app.post('/api/register', async (req, res) => {
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


    // Check if user already exists, add them if not, generate and add refreshToken and authToken    
    try {
        const { Item } = await getUser(userData.username);
        
        if (Item) {
            return res.status(409).json({ error: "Username already taken" });
        }
    
        await addUser(userData);
    
        const authToken = generateAuthToken(userData);
        const refreshToken = jwt.sign({ username: userData.username }, process.env.REFRESH_TOKEN_SECRET);
    
        // THIS SHOULD BE REPLACED BY PUTTING THE REFRESH TOKEN IN THE DATABASE
        await addRefreshToken(userData.username, refreshToken);
    
        return res.json({ authToken: authToken, refreshToken: refreshToken });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

// TEMPORARY ENDPOINT FOR TESTING (REMEMBER TO DELETE THIS)
app.get('/api/test', authenticateToken, (req, res) => {
    return res.json(refreshTokens);
})

// LOGIN USER (returns a new authtoken and refreshtoken)
app.post('/api/login', async (req, res) => {
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
    // ALSO FETCH THIS USER DATA FROM THE DATABASE TO USE FOR THE LINES BELOW (should have a username and password)
    try {

        const { Item } = await getUser(reqUserData.username);

        if (!Item) {
            return res.status(403).json({ error: "Unauthorized, user doesn't exist" });
        }

        const isPasswordValid = await checkPassword(reqUserData.password, Item.password);

        if (!isPasswordValid) {
            return res.status(403).json({ error: "Unauthroized, incorrect password"});
        }
        const userData = Item;
    
        const authToken = generateAuthToken(userData);
        const refreshToken = jwt.sign({ username: userData.username }, process.env.REFRESH_TOKEN_SECRET);
    
        await addRefreshToken(userData.username, refreshToken);
    
        return res.json({ authToken: authToken, refreshToken: refreshToken });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

function generateAuthToken(userData) {
    // EDIT THE 15s TO SOMETHING BIGGER THIS IS JUST FOR TESTING
    return jwt.sign({ username: userData.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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
