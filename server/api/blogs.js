import { getBlogs } from '~/server/utils/dbClient';

export default defineEventHandler(async (event) => {
    const blogs = await getBlogs();
    return blogs;
});