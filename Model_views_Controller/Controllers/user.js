const Module = require("node:module");
const User = require("../models/user");
const { error } = require("node:console");

async function getAllUsers(req,res){
    const allDBusers=await User.find({})// it will return all the users from the database
    return res.json(allDBusers)
}

async function getUserbyID(req,res){
    const user=await User.findById(req.params.id)// it will return the user with the given id from the database
    if(!user) return res.status(404).json({error:'user not found'});
    return res.json(user)
}

async function createUser(req,res){
    const body=req.body;
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json("All fields are required");
    }
    const result=await User.create({
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        gender:body.gender,
        job_title:body.job_title})
    return res.status(201).json({status:"success",id:result._id})
}

async function updateUser(req,res){
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
}

async function deleteUser(req,res){
        try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({status:"user not found"})
        }
        return res.json({status:"success",id:req.params.id})
    } catch(err) {
        return res.status(400).json({status:"error",message:err.message})
    }
}









module.exports={
    getAllUsers,
    getUserbyID,
    createUser,
    updateUser,
    deleteUser

}