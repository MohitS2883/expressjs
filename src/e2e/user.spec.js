import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe('create user and login',()=>{
    let app
    beforeAll(async ()=>{
        await mongoose.connect('mongodb://localhost:27017/expresstuttest')
        .then(()=> console.log('Connected to the db'))
        .catch((err)=> console.log(err))
        app = createApp()
    })

    it('should create the user',async ()=>{
        const response = await request(app).post('/api/users').send({
            username:'Kendall Roy',
            displayName:'Eldest Boy',
            password:'L to the OG'
        })
        expect(response.statusCode).toBe(201)
    })

    it('should log the user in and visit /api/auth/status',async ()=>{
        const response = await request(app).post('/api/auth').send({
            username:'Kendall Roy',password:'L to the OG'})
            .then((res)=>{
                console.log(res.headers['set-cookie'])
                return request(app)
                .get('/api/auth/status')
                .set('Cookie',res.headers['set-cookie'])
            })
        expect(response.statusCode).toBe(200)
        
    })

    // it('should visit /api/auth/status and return authenticated user',async ()=>{
    //     const response = await request(app).get('/api/auth/status')
    //     expect(response.statusCode).toBe(200)
    // })

    afterAll(async ()=>{
        await mongoose.connection.close()
    })
})