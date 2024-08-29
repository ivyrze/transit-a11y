import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ cookies }) => {
    cookies.delete('token', {
        path: '/'
    });

    return json({});
};