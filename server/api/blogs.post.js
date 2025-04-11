import { addBlog } from '~/server/utils/dbClient';
import { createError } from 'h3';
import { authenticateToken } from '../utils/auth';
import { v4 as uuidv4 } from 'uuid';


export default defineEventHandler(async (event) => {
    authenticateToken(event);

    const blogData = await readBody(event);
    if (!blogData) {
        throw createError({ statusCode: 400, message: "Invalid data recieved" });
    }
    
    blogData.id = uuidv4();
    blogData.username = event.context.userData.username;
    blogData.date = Date.now();

    try {
        await addBlog(blogData);
        return { status: 'success', message: 'Blog created successfully' };
    } catch (error) {
        throw createError({ statusCode: 500, ststusMessage: error.message });
    }
})