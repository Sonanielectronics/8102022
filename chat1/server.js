const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000 ;

app.use(express.static(__dirname + '/public'))

http.listen(PORT, ()=>{
    console.log("listen at port number 3000");
})

app.get('/',(req,res)=>{
    // res.send("Hello world");
    res.sendFile(__dirname + '/index.html');
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message'
    , (msg) => {
        socket.broadcast.emit('message', msg)
    }
    )

})

