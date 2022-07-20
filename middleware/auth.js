const jwt = require('jsonwebtoken');
const secretKey = "73bdc18e32d47c38ef80854241ac41b016a3aea80f401370cd11e575cff210cfa49087"
const User = require('../Model/userModel')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const error = new Error();
    error.status = 403;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, secretKey);
                req.user = user;
                return next();
            } catch (e) {
                error.message = 'invalid/expired token';
                return res.status(403).message('invalid/expired token');
            }
                }
        error.message = 'authorization token must be Bearer [token]';
        return res.status(403).message('authorization token must be Bearer [token]');
    }
    error.message = 'authorization header must be provided';
    return res.status(403).json({message:'authorization header must be provided'});
};