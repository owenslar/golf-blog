import { queryRefreshToken } from "../utils/dbClient";
import { generateAuthToken } from "../utils/auth";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const refreshToken = body.token;

    if (!refreshToken) {
        throw createError({ statusCode: 401, message: 'Missing or invalid refresh token' });
    }

    const tokens = await queryRefreshToken(refreshToken);

    if (tokens.length === 0) {
        throw createError({ statusCode: 403, message: 'Unauthorized, please log in again' });
    }
    try {
        const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const authToken = generateAuthToken({ username: userData.username, password: userData.password });
        return { authToken };
    } catch (err) {
        throw createError({ statusCode: 403, message: 'Invalid refresh token' });
    }

});