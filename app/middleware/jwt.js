import { verify } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';

export const jwt = options => async (c, next) => {
    const token = c.req.cookie('token');

    if (!token) {
        if (options.required) {
            throw new HTTPException(401);
        } else {
            await next();
            return;
        }
    }

    const payload = await verify(token, process.env.JWT_SECRET);

    if (!payload) {
        if (options.required) {
            throw new HTTPException(401);
        } else {
            await next();
            return;
        }
    }

    c.set('jwtPayload', payload);

    await next();
};

export default jwt;