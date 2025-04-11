import { addUser, addRefreshToken } from '~/server/utils/dbClient';
import { generateAuthToken } from '../utils/auth';
import { createError } from 'h3';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const userData = await readBody(event);

    if (!userData) {
        throw createError({ statusCode: 400, message: 'Invalid data recieved' });
    }
    if (!userData.username || userData.username === null || userData.username === '') {
        throw createError({ statusCode: 400, message: 'Bad request, invalid username' });
    }
    if (!userData.password || userData.password === null || userData.password === '') {
        throw createError({ statusCode: 400, message: 'Bad request, invalid password' });
    }

    const { Item } = await getUser(userData.username);

    if (Item) {
        throw createError({ statusCode: 409, message: 'Username already taken' });
    }

    await addUser(userData);

    const authToken = generateAuthToken(userData);
    const refreshToken = jwt.sign({ username: userData.username }, process.env.REFRESH_TOKEN_SECRET);

    await addRefreshToken(userData.username, refreshToken);

    return { authToken: authToken, refreshToken: refreshToken };
})