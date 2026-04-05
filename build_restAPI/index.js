const express=require('express');
const users = require('./mock_data.json');
const app=express()
const port=8001
const fs=require('fs')
const path=require('path')
// middleware what it will do that whenver data will come it will put in the body
app.use(express.urlencoded({extended:false}))
app.use(express.json())

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
    return res.json(users)
});

app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id)
    return res.json(user)

})
// we cannot directly post , patch, delete
app.post('/api/users',(req,res)=>{
    const body=req.body;// now express dont know which type of data is coming so we will use middleware
    users.push({...body,id:users.length+1})
    fs.writeFile(path.join(__dirname,'mock_data.json'),JSON.stringify(users),(err,data)=>{
        return res.json({status:"success",id:users.length})
    })
    

})

app.patch('/api/users/:id',(req,res)=>{
    // edit the user with id
    return res.json({status:"pending"});

})
app.delete('/api/users/:id',(req,res)=>{
    // delete the user with id
    return res.json({status:"pending"});

})

// now we can see '/api/users/:id' is same in 3 routes so we can also merge them into oen
app.route('/api/users/:id').get((req,res)=>{
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id)
    return res.json(user)

}).post((req,res)=>{
    
    return res.json({status:"pending"})

}).delete((req,res)=>{
    // edit the user with id
    return res.json({status:"pending"})

})





app.listen(port,()=>console.log("server started"))