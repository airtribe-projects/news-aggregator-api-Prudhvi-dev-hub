const express = require("express");
const router = express.Router();
const { news } = require("../controllers/news-controller");

router.use(express.json());

router.get('/',async (req,res)=>{
    const authUser = req.authUser;
    const newsStatus = await news(authUser);
    return res.status(newsStatus.status).send(newsStatus.data);
});

module.exports = router;