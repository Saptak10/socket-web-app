import { io } from "socket.io-client"

const joinRoomButton = document.getElementById("room-button")
const messageInput = document.getElementById("message-input")
const roomInput = document.getElementById("room-input") 
const form = document.getElementById("form")

const socket = io("http://localhost:3000")  // connecting the client to server port at 3000
const userSocket = io("http://localhost:3000/user", { auth:  { token : "Test" }
})  //to connect user or client in a specific route using the token sent on logging in
socket.on('connect', () => {
    displayMessage(`You connected with id: ${socket.id}`)
    // socket.emit('custom-event', 10, 'Hi', { a: 'a' })  //emit is used to send custom events along with info we want to the server
})  //connect event runs everytime this client connect to the server

userSocket.on("connect_error", error => {   //this event sends the server the error message from client when there's an error
    displayMessage(error)   //displays error on screen
})

socket.on('receive-message', message => {  //receives the message from client sent by the client
    displayMessage(message)
})

form.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value
    const room = roomInput.value

    if (message === "") return
    displayMessage (message)
    socket.emit('send-message', message, room )  // sends this event message and room value to server when form is submitted

    messageInput.value = " "
})

joinRoomButton.addEventListener("click", () => {
    const room = roomInput.value
    socket.emit('join-room', room, message => {
        displayMessage(message)
    })  // sends the room id or name that client enters to join
})

function displayMessage(message) {
    const div = document.createElement("div")
    div.textContent = message
    document.getElementById("message-container").append(div)
}

// offline/online

let count = 0

setInterval(() => {
    socket.emit('ping', ++count)    //when disconnected stores the offline sent count values and then when connected again send back the stored values of count again all at once (example receiving offline messages in whatsapp when coming online again)
    socket.volatile.emit('ping', ++count)    //when disconnected does not stores the offline sent count values and thus when connected continue sending the new count values sent when online (example when message is sent in offline mode it cancels it and doesn't send the message)
}, 1000)   //send to server the count value by incrementing in a delay of 1 sec 

document.addEventListener('keydown',e => {
    if(e.target.matches('input')) return

    if(e.key === 'c') socket.connect()    //connect the connection from client with server ( online )
    if(e.key === 'd') socket.disconnect()    //disconnect the connection from client with server ( offline )
})