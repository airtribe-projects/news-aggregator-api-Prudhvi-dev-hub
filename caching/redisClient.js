const {createClient} = require('redis');
const dotenv = require('dotenv');

dotenv.config();
const redisPort = process.env.REDIS_PORT;

const redisClient = createClient({
    url: redisPort,
});

redisClient.on('error',(err)=>console.error('Redis Client Err',err));

(async ()=>{
    await redisClient.connect();
})();

module.exports = redisClient;






