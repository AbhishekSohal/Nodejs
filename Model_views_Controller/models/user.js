const mongoose = require('mongoose')
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

const User=mongoose.model('user',userSchema)// it will create a collection named user in the database and it will use the userSchema to create the documents in the collection it takes two arguments first is the name of the collection and second is the schema which we want to use to create the documents in the collection
module.exports=User
