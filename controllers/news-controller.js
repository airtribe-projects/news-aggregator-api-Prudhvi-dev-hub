const axios = require('axios');
const fs = require('fs');
const path = require("path");
const preferencesModelPath = path.join(__dirname, '../models/user-preferences-model.txt');
const dotenv = require('dotenv');

dotenv.config();
const baseUrl = process.env.NEWS_BASE_URL;
const defaultPreference = process.env.DEFAULT_PREFERENCE;
const redisClient = require('../caching/redisClient');

const news = async(authUser)=>{
    let preferencesStorage = fs.readFileSync(preferencesModelPath);  
    let preferencesList = preferencesStorage.length>0?JSON.parse(preferencesStorage):[];

    let userPreference = preferencesList.filter(pref=>pref.userId==authUser.user_id);

    const preferenceList = userPreference?.[0]?.preferences || [];

    const preferenceKey = preferenceList.map(pref=>pref).join(",");

    try{

        const cached = await redisClient.get(preferenceKey);

        if(cached){
            //cache hit
            console.log('Returing from cache');
            return JSON.parse(cached);
        }

        if(userPreference.length){
            const articles = [];
            for(const preference of preferenceList){            
                const response = await axios.get(`${baseUrl}/top-headlines/sources?category=${preference}&language=en`,{
                    headers: {
                        'X-Api-Key': process.env.NEWS_API_KEY,
                    }
                });
                const preferenceArticles = response?.data?.sources || [];                       
                articles.push(...preferenceArticles);        
            }

            //cache miss then store and return
            await redisClient.setEx(preferenceKey,3600,JSON.stringify({
                status: 200,
                data: {
                    articles,
                    status: 200,
                    message: "Articles list fetched successfully"
                },
            }));

            return {
                status: 200,
                data: {
                    articles,
                    status: 200,
                    message: "Articles list fetched successfully"
                },
            };           
        }else{

            const cached = await redisClient.get(defaultPreference);

            if(cached){
                //cache hit
                console.log('Returing from cache');
                return JSON.parse(cached);
            }

            const response = await axios.get(`${baseUrl}/top-headlines/sources?category=${defaultPreference}&language=en`,{
                    headers: {
                        'X-Api-Key': process.env.NEWS_API_KEY,
                    }
            });
            const defaultArticles = response?.data?.sources || [];
            
            //cache miss then store and return
            await redisClient.setEx(defaultPreference,3600,JSON.stringify({
                status: 200,
                data: {
                    articles: defaultArticles,
                    status: 200,
                    message: "Articles list fetched successfully"
                },
            }));

            return {
                status: 200,            
                data: {
                    articles: defaultArticles,
                    status: 200,
                    message: "Articles list fetched successfully"
                },
            };
        }
    }catch(err){
        return err;
    }
}

module.exports = {news};

