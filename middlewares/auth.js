const jwt = require('jsonwebtoken');
const JWT_SECRET = 'b986697cb33cf9b6081545a47eaaab9a594fe50419e1b5a98ddd58b3ac26506d';

const authGuard = (req,res,next)=>{    
    const reqHeaders = req.headers['authorization'];
    const token = reqHeaders ? reqHeaders.split(" ")[1]:null;    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.authUser = decoded;
    } catch (error) {
        return res.status(401).send({status: 401,error: error.message});
    }
    next();
}

module.exports = authGuard;