import { getUser, addRefreshToken } from '../utils/dbClient';
import { checkPassword, generateAuthToken } from '../utils/auth';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    let userData = await readBody(event);

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

    if (!Item) {
        throw createError({ statusCode: 403, message: "Unauthorized, user doesn't exist" });
    }

    const isPasswordValid = await checkPassword(userData.password, Item.password);

    if (!isPasswordValid) {
        throw createError({ statusCode: 403, message: 'Unauthorized, incorrect password' });
    }

    userData = Item;

    const authToken = generateAuthToken(userData);
    const refreshToken = jwt.sign({ username: userData.username }, process.env.REFRESH_TOKEN_SECRET);

    await addRefreshToken(userData.username, refreshToken);

    return { authToken: authToken, refreshToken: refreshToken };
})