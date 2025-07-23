const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require("path");
const preferencesModelPath = path.join(__dirname, '../models/user-preferences-model.txt');

const findPreferences = async(authUser)=>{
    let preferencesStorage = fs.readFileSync(preferencesModelPath);  
    let preferencesList = preferencesStorage.length>0?JSON.parse(preferencesStorage):[]; 
    
    const preference = preferencesList.filter(pref=>pref.userId==authUser.user_id);    
    return {status: 200,preferences: preference.map(pref=>pref.preferences)};    
}

const preferencesUpdation = async (data,authUser)=>{
    let preferencesStorage = fs.readFileSync(preferencesModelPath);
    let preferencesList = preferencesStorage.length>0?JSON.parse(preferencesStorage):[];    
    let toUpdatePreference = {};

    for(const preference of preferencesList){
        if(preference.userId === authUser.user_id){
            toUpdatePreference = {
                ...preference,
                preferences: data.preferences,
                updatedAt: new Date().toJSON(),                
            }
            break;
        }
    }

    if(!Object.keys(toUpdatePreference).length){
        toUpdatePreference = {
            id: randomUUID(),
            userId: authUser.user_id,
            preferences: data.preferences,
            createdAt: new Date().toJSON(),
            updatedAt: new Date().toJSON(),
            deletedAt: null,
        }
    }

    if(preferencesList.length>0){
        preferencesList = preferencesList.filter(pref=>pref.userId!=authUser.user_id);
    }

    preferencesList = [...preferencesList,toUpdatePreference];

    fs.writeFile(preferencesModelPath,JSON.stringify(preferencesList),async (err,data)=>{
        console.log("Preference written successfully");        
    });

    return {status: 200,preferences: [...preferencesList.map(pref=>pref.preferences)]};    
}

module.exports = {preferencesUpdation,findPreferences};

