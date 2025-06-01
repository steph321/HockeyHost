import express from 'express'
import {Server} from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, "public")))

app.get('/api/news', async (_req,res)=>{
    try{
        const apiKey=process.env.NEWS_API_KEY
        if(!apiKey){
            return res.status(500).json({error:"API key is not set"})
        }
        const newsUrl= `https://newsapi.org/v2/everything?q=South%20Africa%20hockey&language=en&apiKey=${apiKey}`
        const response = await fetch(newsUrl)
        const data = await response.json()

        if(response.ok){
            res.json(data)
        }else{
            res.status(response.status).json({error:data.message || 'Error fetching news'})
        }
    }catch(error){
        console.error('Error fetching news:', error)
        res.status(500).json({error:'server error fetching news'})
    }
})


const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

//state
const UsersState={
    users:[],
    setUsers: function(newUsersArray){
        this.users=newUsersArray
    }
}

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? ["https://hockeyhost.onrender.com"]  : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket =>{
console.log(`User ${socket.id} connected`)

//Upon connection - only to connected users
socket.emit('message', buildMsg(ADMIN, 'Welcome to the chat room player!'))


socket.on('enterRoom', ({name, room}) => {
    //Leave previous room
    const prevRoom = getUser(socket.id)?.room

    if(prevRoom){
        socket.leave(prevRoom)
        io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} left the room`))
    }

    const user = activateUser(socket.id, name, room)

    //Cannot Update previous room users, unti after State update in activate user
    if(prevRoom){
        io.to(prevRoom).emit('userList',{users: getUsersInRoom(prevRoom)
        })
    }

    //join new room
    socket.join(user.room)

    //To User that joined
    socket.emit('message', buildMsg(ADMIN, `You joined ${user.room} chat room`))

    //everyone else
    socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))

    //Update user list for room
    io.to(user.room).emit('userList', {
        users:getUsersInRoom(user.room)
    })

    //Update room for All
    io.emit('roomsList', {
        rooms: getAllActiveRoom()
    })
})

//when user disconnects-everyone else
    socket.on('disconnect', ()=>{
        const user=getUser(socket.id)
        userLeaves(socket.id)


      if(user){
        io.to(user.room).emit('message', buildMsg(ADMIN,`${user.name } left room`))

        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        io.emit('roomList', {
            rooms: getAllActiveRoom()
        })
      }
      console.log(`User ${socket.id} disconnected`)
    })

//Listening for a message
    socket.on('message', ({name, text}) => {
        const room = getUser(socket.id)?.room
        if(room){
            io.to(room).emit('message', buildMsg(name, text))
        }
    })

    //Listen for activity
    socket.on('activity', (name)=>{
        const room = getUser(socket.id)?.room
        if(room){
            socket.broadcast.to(room).emit('activity',name)
        }
    })
})

function buildMsg(name, text){
    return {
        name,
        text,
        time:new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second:'numeric'
        }).format(new Date())
    }

}

//User functions
function activateUser(id,name, room){
    const user={id,name, room}
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeaves(id){
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !==id)
    )
}

function getUser(id){
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room){
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRoom(){
    return Array.from(new Set (UsersState.users.map(user => user.room)))
}

