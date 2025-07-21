const express = require("express");
const router = express.Router();
const {preferencesUpdation, findPreferences} = require('../controllers/user-controller');

router.use(express.json());

router.get('/',async (req,res)=>{
    const authUser = req.authUser;
    const preferenceStatus = await findPreferences(authUser);
    return res.status(preferenceStatus.status).send(preferenceStatus.data);
});

router.put('/',async(req,res)=>{
    const toUpdatePreference = req.body;
    const authUser = req.authUser;
    const preferenceStatus = await preferencesUpdation(toUpdatePreference,authUser);
    return res.status(preferenceStatus.status).send(preferenceStatus.data);
});

module.exports = router;