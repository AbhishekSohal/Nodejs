const express=require('express');

const connectDB=require('./connection')// it will import the connectDB function which we have defined in the connection.js file and we will use this function to connect to the database

const logReqRes=require('./Middlewares')// it will import the logReqRes middleware which we have defined in the middlewares/logReqRes.js file and we will use this middleware to log the request and response of the server


const userRouter=require('./routes/user')// it will import the userRouter which we have defined in the routes/user.js file and we will use this router to define our routes in the main app.js file

const app=express()// it will create an instance of the express application and we can use this instance to define our routes and middleware
const port=8002


// Connecting mongoose
connectDB('mongodb://127.0.0.1:27017/app-1').then(()=>console.log('mongodb connected'))
.catch((err)=>console.log('mongo error',err))

//Middlewares-Plugin
app.use(express.urlencoded({extended:false}))
app.use(logReqRes('log.txt'));





app.use('/api/users',userRouter)// it will use the userRouter for all the routes which starts with /api/users
app.listen(port,()=>console.log("server started"))

// user route ko control krta hai and user aur route ke beech mai middleware aa jata hai eg authentication etc , aur routes controller ko controll krta hai and controller models mai changes krta hai





