import { getBlog } from '~/server/utils/dbClient';
import { createError } from 'h3';



export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    const foundBlog = await getBlog(id);

    if (!foundBlog) {
        throw createError({
            statusCode: 404, message: 'Blog not found'
        });
    }

    return foundBlog;
})