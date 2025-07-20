const express = require("express");
const router = express.Router();
const {register,login} = require('../controllers/auth-controller');

router.use(express.json());

router.post('/register',async (req,res)=>{
    const toRegisterUser = req.body;
    console.log('Registered user router:',toRegisterUser);
    const registerStatus = await register(toRegisterUser);    
    return res.status(registerStatus.status).send(registerStatus.data);
});

router.post('/login',async(req,res)=>{    
    const toLoginUser = req.body;
    console.log(toLoginUser);
    const loginStatus = await login(toLoginUser);    
    return res.status(loginStatus.status).send({
        token:loginStatus.token,
        message: loginStatus.data,
    });
});

module.exports = router;