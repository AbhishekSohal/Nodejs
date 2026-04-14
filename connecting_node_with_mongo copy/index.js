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
//Schema
const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,// it means entry is required
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    job_title:{
        type:String
    },
    gender:{
        type:String

    }
},{timestamps:true}// it will add createdAt and updatedAt fields to the document
)

const User=mongoose.model('user',userSchema)// it will create a collection named users in the database and it will use the userSchema to create the documents in the collection it takes two arguments first is the name of the collection and second is the schema which we want to use to create the documents in the collection






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

app.get('/users',async(req,res)=>{
    /* 
    <ul>
        <li>Abhishek </li>
    */
   const allDBusers=await User.find({})// it will return all the users from the database
   const html=`
   <ul>
      ${allDBusers.map((user)=>`<li>${user.first_name}-${user.email}</li>`).join("")}
   </ul>`;
   res.send(html)

});
//Rest apis
app.get('/api/users',async(req,res)=>{//headers are the meta data which is sent along with the request and response
    const allDBusers=await User.find({})// it will return all the users from the database
    return res.json(allDBusers)
});

app.get('/api/users/:id',async(req,res)=>{
    const user=await User.findById(req.params.id)// it will return the user with the given id from the database
    return res.json(user)

})
// we cannot directly post , patch, delete
app.post('/api/users',async(req,res)=>{// we are using async because we are using mongoose which is asynchronous which means it will take some time to execute and we dont want to block the event loop while it is executing
    const body=req.body;// now express dont know which type of data is coming so we will use middleware
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json("All fields are required");
    }
    const result=await User.create({// await is used to wait for the promise to resolve and then we will send the response to the client
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        gender:body.gender,
        job_title:body.job_title})
    return res.status(201).json({status:"success",result})
});


app.patch('/api/users/:id',async(req,res)=>{
    // edit the user with id
    try{
        const user= await User.findByIdAndUpdate(req.params.id,req.body,{new:true})// it will update the user with the given id in the database and return the updated user req.query is the data which we want to update and {new:true} means it will return the updated user
         if (!user) {
        return res.json({status:"user not found"})
    }
    return res.json({status:"success",user})
    } catch(err){
        return res.status(400).json({status:"error",message:err.message})
    }
   
  
    })



app.delete('/api/users/:id',async(req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({status:"user not found"})
        }
        return res.json({status:"success",id:req.params.id})
    } catch(err) {
        return res.status(400).json({status:"error",message:err.message})
    }
})

app.listen(port,()=>console.log("server started"))





