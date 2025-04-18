import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcrypt';

const dynamoDBClient = new DynamoDBClient({
    region: 'us-west-2',
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    // }
});

const dbclient = DynamoDBDocumentClient.from(dynamoDBClient);

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
    allBlogs.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });
    return allBlogs;
}

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
            return Item;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("error retrieving blog: " + error.message);
    }
}

// Data access method for adding a blog
const addBlog = async (blogData) => {
    try {
        const command = new PutCommand({
            TableName: "Golf-Blog-Blogs",
            Item: blogData,
        });

        await dbclient.send(command);
    } catch (error) {
        throw new Error("Error adding blog: " + error.message);
    }
}

// Data access method for deleting a blog
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

// Data access method for checking if a refresh token exists in DB
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

// Data access method for deleting all refresh tokens associated with a username
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

// Data access method for getting a single user from database
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

// Data access method for adding a single user to database
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

// Data access method for adding a single refreshToken
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

export { dbclient, getBlogs, getBlog, addBlog, deleteBlog, queryRefreshToken, deleteRefreshTokens, getUser, addUser, addRefreshToken };