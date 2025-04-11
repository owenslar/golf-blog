import { authenticateToken } from "../../utils/auth";
import { getBlog, deleteBlog } from '../../utils/dbClient';

export default defineEventHandler(async (event) => {
    authenticateToken(event);

    const deleteId = getRouterParam(event, 'id');

    const userData = event.context.userData;

    if (!deleteId) {
        throw createError({ statusCode: 400, message: 'No ID provided' });
    }
    const blog = await getBlog(deleteId);
    if (!blog) {
        throw createError({ statusCode: 400, message: 'blog not found' });
    }
    if (blog.username !== userData.username) {
        throw createError({ statusCode: 403, message: 'This blog is not yours' });
    }

    try {
        await deleteBlog(deleteId);
    } catch (error) {
        throw createError({ statusCode: 500, message: error.message });
    }

    return;
})