const express=require('express');
const users = require('./mock_data.json');
const app=express()
const port=8002
const fs=require('fs')
const path=require('path')
// middleware what it will do that whenver data will come it will put in the body
app.use(express.urlencoded({extended:false}))
app.use(express.json())// it will parse the data which is coming in the request body and put it in the req.body

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

app.get('/users',(req,res)=>{
    /* 
    <ul>
        <li>Abhishek </li>
    */
   const html=`
   <ul>
      ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
   </ul>`;
   res.send(html)

});
//Routes
app.get('/api/users',(req,res)=>{
    res.setHeader("X-myname","abhishek")// we can also set the headers in the response
    // Always add X before the custom header name to avoid conflicts with standard headers
    console.log(req.headers);// we can also access the headers which are coming in the request
    return res.json(users)
});

app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id)
    if (!user) {
        return res.status(404).json({status:"user not found"})
    }
    return res.json(user)

})
// we cannot directly post , patch, delete
app.post('/api/users',(req,res)=>{
    const body=req.body;// now express dont know which type of data is coming so we will use middleware
    if (!body.first_name || !body.last_name||!body.email||!body.gender||!body.job_title) {
        return res.status(400).json({status:"failed",msg:"All fields are required"})
    }
    users.push({...body,id:users.length+1})
    fs.writeFile(path.join(__dirname,'mock_data.json'),JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:"success",id:users.length})
    })
})
app.patch('/api/users/:id',(req,res)=>{
    // edit the user with id
    const body=req.body;// it will give us the data which we want to update
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id)
    if (!user) {
        return res.status(404).json({status:"user not found"})
    }
    users[users.indexOf(user)]={...user,...body};// it will update the user with the new data//... means spread operator it will take all the properties of the user and then we will overwrite the properties which we want to update with the new data
    fs.writeFile(path.join(__dirname,'mock_data.json'),JSON.stringify(users),(err,data)=>{
        return res.status(200).json({status:"success",id:id})
    })


})
app.delete('/api/users/:id',(req,res)=>{
    // delete the user with id
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id)
    if (!user) {
        return res.status(404).json({status:"user not found"})
    }
    users.splice(users.indexOf(user),1);// it will remove the user from the array
    fs.writeFile(path.join(__dirname,'mock_data.json'),JSON.stringify(users),(err,data)=>{
        return res.status(200).json({status:"success",id:id})
    })


})

// now we can see '/api/users/:id' is same in 3 routes so we can also merge them into oen
app.route('/api/users/:id').get((req,res)=>{
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id)
    return res.status(200).json(user)

}).post((req,res)=>{
    
    return res.status(201).json({status:"pending"})

}).delete((req,res)=>{
    // edit the user with id
    return res.status(200).json({status:"pending"})

})





app.listen(port,()=>console.log("server started"))