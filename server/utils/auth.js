import jwt from 'jsonwebtoken';
import { getHeader } from 'h3';
import bcrypt from 'bcrypt';

export const authenticateToken = (event) => {
    const authHeader = getHeader(event, 'authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Token missing' });
    }

    try {
        const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        event.context.userData = userData;
    } catch (err) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden: Invalid token' });
    }
};

export const generateAuthToken = (userData) => {
    return jwt.sign({ username: userData.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Helper function for comparing salted and hashed passwords
export const checkPassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
}

// Helper function for extracting username from a refreshToken
export const extractUserData = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}


