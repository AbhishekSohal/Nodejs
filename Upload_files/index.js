const path=require('path');
const express=require('express');
const multer=require('multer')

const app=express();
const PORT=8000;

//const upload=multer({dest: "uploads/"})// its a middleware in this file that user uploaded will be stored if not defined local storage will be used

const storage=multer.diskStorage({destination : function(req,file,cb){
    return cb(null,'./uploads')
},
filename : function(req,file,cb){
    return cb(null,`${Date.now()}-${file.originalname}`)
}})

const upload=multer({storage:storage});


app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get("/",(req,res)=>{
    return res.render("homepage")
});

app.post("/upload",upload.single('profileImage'), (req,res)=>{
    console.log(req.body)
    console.log(req.file)

    return res.render('homepage')

})

// for multiple file upload
app.post("/upload-multiple",upload.array('profileImages',5), (req,res)=>{
    console.log(req.body)
    console.log(req.files)
})

app.listen(PORT,()=>console.log('Server Started at PORT:8000'));
