const express=require('express');
const router=express.Router()// it will create a new router object which we can use to define our routes and then we can export this router and use it in our main app.js file
const {getAllUsers,getUserbyID,createUser,updateUser,deleteUser}=require('../Controllers/user')






//Rest apis
router.get('/',getAllUsers);

router.get('/:id',getUserbyID);

router.post('/',createUser);

router.patch('/:id',updateUser);

router.delete('/:id',deleteUser);


module.exports=router