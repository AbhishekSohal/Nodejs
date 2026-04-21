const express=require('express');
const path=require('path')
const connectDB=require('./connection')
const URL=require('./models/url')

const app=express();
const port=8003

const urlRoute=require('./routes/url')
const staticRoute=require('./routes/staticRouter')
const userRoute=require('./routes/user')

connectDB('mongodb://127.0.0.1:27017/short-url').then(()=>console.log('MongoDB connected')).catch(()=>console.log('coudnt connect try again'));

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

 


app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/url',urlRoute)
app.use('/user',userRoute)
app.use('/',staticRoute)


app.listen(port,()=>console.log('Server Started'))