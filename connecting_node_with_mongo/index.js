const express=require('express');


const app=express()
const port=8002
const fs=require('fs')
const path=require('path')
const mongoose=require('mongoose');
//Connecting mongoose
mongoose.connect('mongodb://127.0.0.1:27017/app-1')
.then(()=>console.log('mongodb connected'))
.catch((err)=>console.log('mongo error',err))






// middleware what it will do that whenver data will come it will put in the body
app.use(express.urlencoded({extended:false}))
app.use(express.json())// it will parse the data which is coming in the request body and put it in the req.body

const { type } = require('os');// it is a built-in module in nodejs which provides operating system-related utility methods and properties. The type method returns a string identifying the operating system platform on which the Node.js process is running.

app.use((req,res,next)=>{
    console.log("middleware1 called");
    //return res.json({mgs:"middleware1 called"})      //what it does is that it will send the response to the client and it will not call the next middleware or the route handler
    req.myUsername="abhishek"// we can also add our own properties to the req object and we can access it in the next middleware or the route handler
    next()// it will call the next middleware or the route handler
})

app.use((req,res,next)=>{
    console.log("middleware2 called");
    //return res.json({mgs:"middleware1 called"})      //what it does is that it will send the response to the client and it will not call the next middleware or the route handler
    console.log(req.myUsername);// we can access the property which we added in the previous middleware
    next()// it will call the next middleware or the route handler
})



app.listen(port,()=>console.log("server started"))





