const http=require('http');
const fs=require("fs");
const url=require("url")
//creating server
const myserver=http.createServer((req,res)=>{
    //console.log(req);// idhr ham keh rhe hain ki jab request aati hai to console log to krdo also request ko end krdo with a response
    const log=`${Date.now()}: new request recieved`;
    const myurl=url.parse(req.url)
    console.log(myurl)
    fs.appendFile('log.txt',log,(error,data)=>{
        res.end("hello from server")});
    //res.end("hello from server")
});// processing incoming request

myserver.listen(8001,()=> console.log("server started"))//8000 port  is like a gate


// jaise browser ne req bheji vo req createserver ke pass gyi aur usne console log kr dia