import express, { request, response } from "express";
import router from "./routes/index.mjs";
import { findusermiddleware, loggingmiddleware } from "./utils/middleware.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import mongoose from "mongoose";
import passport from "passport";
import "./strategies/local-strategy.mjs"

const app = express()

mongoose.connect('mongodb://localhost:27017/expresstut')
.then(()=> console.log('Connected to the db'))
.catch((err)=> console.log(err))

app.use(express.json())
app.use(session({
    secret: 'all hail the tiger',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
})) // before registering the endpoints
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser('secret')) // before all the routes
app.use(router)

app.post('/api/auth',passport.authenticate('local'),(request,response)=>{
    response.sendStatus(200)
})

app.get('/api/auth/status',(request,response)=>{
    console.log(request.user)
    console.log(request.session)
    return request.user ? response.send(request.user) : response.sendStatus(401)
})

app.post('/api/auth/logout',(request,response)=>{
    if(!request.user) return response.sendStatus(401)
    request.logOut((err)=>{
        if(err) return response.sendStatus(400)
        return response.sendStatus(200)
    })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Running on Port ${PORT}`)
})

// get request
app.get('/',loggingmiddleware,(request, response)=>{
    console.log(request.session)
    console.log(request.sessionID)
    request.session.visited = true
    response.cookie('Hello','World',{maxAge:30000,signed:true})
    response.status(201).send({msg:'Hello'})
})

// session duration of user on a website
// http is stateless
// we have no idea who is making the request
// we need to track the request onr use case is user authentication
// server -> function -> session id

// app.post('/api/auth',(request,response)=>{
//     const { body: {name, password} } = request
//     console.log(request.body)
//     console.log(request.user)
//     const findUser = mockUsers.find(
//         user => user.name === name
//     )
//     if(!findUser || findUser.password !== password) 
//         return response.status(401).send({msg:"Bad credentials"})

//     request.session.user = findUser 
//     return response.status(200).send(findUser)

// })

// app.get('/api/auth/status',(request,response)=>{
//     request.sessionStore.get(request.sessionID,(err,session)=>{
//         console.log(session)
//     })
//     return request.session.user ? response.status(200).send(request.session.user):
//     response.status(401).send({msg:"BAD CREDENTIALS"})
// })

