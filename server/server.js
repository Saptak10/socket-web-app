const io = require("socket.io")(3000)

io.on("connection", socket => {  //connection event to connect to the client server at port 8080
    console.log(socket.id)
})