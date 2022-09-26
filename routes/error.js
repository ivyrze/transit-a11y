import httpErrors from 'http-errors';

export const errorMiddleware = (error, req, res, next) => {
    const title = httpErrors(error.status).message
        .replace(/(?<!^)(\b[A-Z])(?![A-Z])/g, letter => letter.toLowerCase());
    
    const description = (error.status >= 500) ?
        "Things aren't working as expected on our end, sorry about that. Try again in a few minutes." :
        "Sorry things aren't working as expected! Try heading back to the homepage.";
    
    res.status(error.status);
    
    if (req.originalUrl.startsWith('/api')) {
        res.json({ error: title, status: error.status });
    } else {
        res.render('error', { title, description });
    }
};

export const notFoundMiddleware = (req, res, next) => {
    errorMiddleware(httpErrors.NotFound(), req, res, next);
};