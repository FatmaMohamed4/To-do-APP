const express=require('express')
const session = require('express-session')
const taskRoute=require('./route/taskRoute.js')
const userRoute=require('./route/userRoute')

const app = express();

app.use(session({
    secret: 'yOur to-do-app sessions', 
    cookie: {maxAge:24*60*60*1000} ,
    resave: true,
    saveUninitialized: true

  }));


app.use(express.json()); 

app.use('/users',userRoute)
app.use('/tasks',taskRoute)

app.use('*', (req, res) => {
    res.status(404).json({
        message: "Page not found"
    });
});





module.exports=app;
