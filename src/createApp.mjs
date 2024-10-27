import router from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import MongoStore from "connect-mongo";
import express from "express";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs"



export function createApp(){
    const app = express()
    app.use(express.json())
    app.use(session({
        secret: 'all hail the tiger',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        store: MongoStore.create({
            // mongoUrl:'mongodb://localhost:27017/expresstut'
            client:mongoose.connection.getClient()
        })
    })) // before registering the endpoints
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(cookieParser('secret')) // before all the routes
    app.use(router)

    app.post('/api/auth',passport.authenticate('local'),(request,response)=>{
        response.sendStatus(200)
    })

    app.get('/api/auth/status',async (request,response)=>{
        return request.user ? response.send(request.user) : response.sendStatus(401)
    })

    app.post('/api/auth/logout',(request,response)=>{
        if(!request.user) return response.sendStatus(401)
        request.logOut((err)=>{
            if(err) return response.sendStatus(400)
            return response.sendStatus(200)
        })
    })

    app.get('/api/auth/discord',passport.authenticate('discord'))
    app.get('/api/auth/discord/redirect',passport.authenticate('discord'),
    (request,response)=>{
        console.log(request.session)
        console.log(request.user)
        response.sendStatus(200)
    })
    return app
}