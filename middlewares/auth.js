const jwt = require('jsonwebtoken');
const JWT_SECRET = 'b986697cb33cf9b6081545a47eaaab9a594fe50419e1b5a98ddd58b3ac26506d';

const authGuard = (req,res,next)=>{    
    const token = req.headers['authorization'];    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.authUser = decoded;
    } catch (error) {
        console.error('Token verification failed:', error.message);
    }
    next();
}

module.exports = authGuard;