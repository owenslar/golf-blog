import { getHeader } from 'h3';
import { extractUserData } from '../utils/auth';
import { deleteRefreshTokens } from '../utils/dbClient';

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, 'authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw createError({ statusCode: 401, message: 'No token provided' });
    }

    const userData = extractUserData(token);

    if (userData === null) {
        return;
    }

    try {
        await deleteRefreshTokens(userData.username);
    } catch (error) {
        throw createError({ statusCode: 500, message: error.message });
    }

    return;
})