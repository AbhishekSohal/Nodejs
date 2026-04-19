const express=require('express');
const connectDB=require('./connection')
const urlRoute=require('./routes/url')
const app=express();
const port=8003

connectDB('mongodb://127.0.0.1:27017/short-url').then(()=>console.log('MongoDB connected')).catch(()=>console.log('coudnt connect try again'));

app.use(express.json());
app.use('/url',urlRoute)


app.listen(port,()=>console.log('Server Started'))