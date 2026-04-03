const express=require('express')
const http=require('http')
const app=express()// this is the handler function // this is the main function which will handle all the request and response

app.get('/', (req, res) => {
    return res.send("hello from homepage")
})// / is for home page
app.get('/about', (req, res) => {
    return res.send("hello from about page"+'hey'+req.query.name+req.query.age)//req.query.name is used to get the name from the query string and name is the key which we will use in the query string to get the value//req.query.age is used to get the age from the query string and age is the key which we will use in the query string to get the value
})// /about is for about page

//const myserver=http.createServer(app)// this will create a server and pass the app as a handler function

//myserver.listen(3000, () => {
    //console.log("server is running on port 3000")
//})// this will start the server on port 3000 and log the message in the console

//express provides a method called listen which is used to start the server on a specific port and it also takes a callback function which will be called when the server is started successfully
app.listen(8000,() => {
    console.log("server is running on port 8000")
})// this will start the server on port 8000 and log the message in the console