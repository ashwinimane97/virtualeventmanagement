const jwt = require('jsonwebtoken');


const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('Token verification error:', err); // Debugging
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }

            req.user = user;
            next();
        });
    } catch (err) {
        console.error('JWT Middleware Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    authenticateToken
}