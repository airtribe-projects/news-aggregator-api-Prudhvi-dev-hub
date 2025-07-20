async function register(req,res,next){
    console.log("registered");
    next();
}

module.exports = {register};