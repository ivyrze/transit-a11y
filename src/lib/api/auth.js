import jwt from 'jsonwebtoken';
import { seconds } from '$lib/utils';
import { JWT_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const authenticate = (cookies, required = true) => {
    const token = cookies.get('token');
    if (!token) {
        return required ? error(401) : {};
    }
    
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
        return required ? error(401) : {};
    }

    delete payload.iat;
    delete payload.exp;

    return payload;
};

export const createSession = (cookies, payload) => {
    const tokenLifetime = seconds('8h');
    const expirationDate = new Date(
        new Date().getTime() + tokenLifetime * 1000
    );

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: tokenLifetime
    });

    cookies.set('token', token, {
        maxAge: tokenLifetime,
        expires: expirationDate,
        httpOnly: true,
        path: '/'
    });
};