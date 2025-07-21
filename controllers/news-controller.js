const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('aec158f7cba941f0b0a36f44a0c3002d');
const fs = require('fs');
const path = require("path");
const preferencesModelPath = path.join(__dirname, '../models/user-preferences-model.txt');

const news = async(authUser)=>{
    let preferencesStorage = fs.readFileSync(preferencesModelPath);  
    let preferencesList = preferencesStorage.length>0?JSON.parse(preferencesStorage):[];

    let userPreference = preferencesList.filter(pref=>pref.userId==authUser.user_id);

    const preferenceList = userPreference[0]?.preferences || [];

    if(userPreference.length){
        const articles = [];
        for(const preference of preferenceList){
            const article = await newsapi.v2.sources({            
                    category: preference,
                    country: "us",
                    language: 'en',            
                });
            if(article?.sources){
                articles.push(...article.sources);
            }
        }

        return {
            status: 200,
            data: {
                articles,
                status: 200,
                message: "Articles list fetched successfully"
            },
        };    
    }else{
        const newsArticles = await newsapi.v2.sources({
            category: 'Technology',
            language: 'en',
            country: 'us'
        });
        return {
            status: 200,
            data: {
                articles: newsArticles,
                status: 200,
                message: "Articles list fetched successfully"
            },
        };
    }
}

module.exports = {news};