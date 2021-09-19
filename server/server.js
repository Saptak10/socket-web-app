const { instrument } = require("@socket.io/admin-ui")  //socket.io admin gui
const io = require("socket.io")(3000, {    // server running on port 3000
    cors:{
        origin: ["http://localhost:8080", "https://admin.socket.io/"],
    },
})

//socket.io authentication on /user route

const userIo = io.of('/user')   //to connect user or client in a specific route
userIo.on('connection', socket => {     //namspace used in user authentication in room joining
    console.log('connected to user namespace with username ' + socket.username)   
})

userIo.use((socket, next) => {   //getting the token sent by the user from client to the server
    if(socket.handshake.auth.token) {    //if the token is present
        socket.username = getUsernameFromToken(s)   //getting the username from the token
        next()
    } else {
        next(new Error("Please send token"))
    }
})

function getUsernameFromToken(token) {     //access the token from the database
    return token
}

io.on("connection", socket => {  // connection event which runs everytime a client connects 
    console.log(socket.id)       // to a server at port 8080 and prints the id (room id)
    // socket.on('custom-event', (number, string, obj) => {  //receives custom events from client
    //     console.log(number, string, obj)
    socket.on('send-message', (message, room) => {      //receives message from client
        if (room === '') {
        // io.emit('receive-message', message )   //sends the received message to client back or other clients (client to client)
        socket.broadcast.emit('receive-message', message)   //sends message to other clients excluding the current client that sends the message
        } else {
            socket.to(room).emit('receive-message', message)  //message sent specifically to that room id that the client are in (broadcasts by default)
        }
        // console.log(message)
    })
    socket.on('join-room', (room, cb) => {    //get the room id or name that the client enters and sends
        socket.join(room)    //assigns the id to the new room id received and joins the room
        cb(`Joined ${room}`)  //callback sending to the current client about the room they joined
    })

    // offline/online
    socket.on("ping", n => console.log(n))   //receives the ping event and prints the count value
})

instrument(io, { auth : false })    //user authentication check