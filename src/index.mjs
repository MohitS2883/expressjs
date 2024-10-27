import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";
// import "./strategies/discord-strategy.mjs"


mongoose.connect('mongodb://localhost:27017/expresstut')
.then(()=> console.log('Connected to the db'))
.catch((err)=> console.log(err))
const app = createApp()

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Running on Port ${PORT}`)
})