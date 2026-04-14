const mongoose=require('mongoose')
//Connecting mongoose
async function connectDB(url){
    return mongoose.connect(url)
}
module.exports=connectDB