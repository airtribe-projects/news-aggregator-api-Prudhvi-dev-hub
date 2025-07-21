const express = require('express');
const app = express();
const authRouter = require('./routes/auth-route');
const userRouter = require('./routes/user-route');
const newsRouter = require('./routes/news-route');
const authGuard = require('./middlewares/auth');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users',authRouter); //Mounting of auth route
app.use('/users/preferences',authGuard, userRouter); //Mounting of preferences route
app.use('/users/news', authGuard,newsRouter); //Mounting of news route

//Health check
app.get('/',(req,res)=>{
    return res.status(200).send("System stable and working..");
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;