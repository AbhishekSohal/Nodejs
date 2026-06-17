const express = require("express");
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')


const app = express();
const server = http.createServer(app)
const io = new Server(server)//  ye yaha par hai jo hamare server aur client ko connect karega 
//Socket.io
// socket means individual user
// in this below "connection" is event and () => {
//     console.log("A user has connected ", socket.id)
// } is callback function
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        io.emit('message', msg) // it will send the message to all the users who are connected to the server
    })

})





app.use(express.static(path.resolve(__dirname, 'public')))


app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, "/public/index.html"))
})




server.listen(3000, () => {
    console.log('server is running')
})

