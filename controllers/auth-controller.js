const { randomUUID } = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require("path");
const hashRounds = 5;
const authModelPath = path.join(__dirname, '../models/auth-model.txt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (data)=>{
    let toCreateUser = {};
    let userStorage = fs.readFileSync(authModelPath);  
    let userList = userStorage.length>0?JSON.parse(userStorage):[];

    if(data?.email && validator.isEmail(data.email)){
        const toHashPassword = data.password;
        //Check if email already exists
        for(const user of userList){
            console.log(user);
            if(user.email === data.email){                
                return {status: 400,data: "Email already exists"};
            }
        }
        const hashedPassword = await bcrypt.hash(toHashPassword,hashRounds);        
        toCreateUser = {
            id: randomUUID(),
            ...data,
            password: hashedPassword,
            createdAt: new Date().toJSON(),
            updatedAt: new Date().toJSON(),
            deletedAt: null,
        };
    }else{        
        return {status: 400,data: "Invalid Email"};
    }

    userList.push(toCreateUser);

    fs.writeFile(authModelPath,JSON.stringify(userList),async (err,data)=>{
        console.log("File written successfully");        
    });

    return {status: 200, data: "User registered successfully"};
}

const login = async(data)=>{    
    let userStorage = fs.readFileSync(authModelPath);  
    let userList = userStorage.length>0?JSON.parse(userStorage):[]; 

    //Check if email already exists
        for(const user of userList){            
            if(user.email === data.email){
                const dbHashedPassword = user.password;                
                const passwordMatch = await bcrypt.compare(data.password,dbHashedPassword);

                if(!passwordMatch){                    
                     return {status: 401,data: "Invalid Credentials"};
                }else{
                    const token = jwt.sign({username: data.email,user_id: user.id},JWT_SECRET,{expiresIn: '1d'});
                    console.log(token);
                    return {status: 200,data:{
                        token,
                        message: "Logged in successfully"
                    }};
                }
            }
        }

    return {status: 404, data: "Email not found"};
}

module.exports = {register,login};