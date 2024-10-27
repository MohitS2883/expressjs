import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe('/api/auth',()=>{
    let app
    beforeAll(async ()=>{
        await mongoose.connect('mongodb://localhost:27017/expresstuttest')
        .then(()=> console.log('Connected to the db'))
        .catch((err)=> console.log(err))
        app = createApp()
    })

    it('should return 401 when not logged in',async()=>{
        const response = await request(app).get('/api/auth/status')
        expect(response.statusCode).toBe(401)
    })

    afterAll(async ()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})