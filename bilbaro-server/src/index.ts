import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth"



dotenv.config();

const app = express()
const PORT = process.env.PORT
app.use(cors())

app.use(express.json())

// /test route

app.get('/',(req,res)=>{
    res.json({message:'Bilbaro app running'})
})

app.use('/api/auth', authRoutes)
mongoose.connect(process.env.MONGO_URI!)
    .then(()=>{
        console.log('monogoose connected')
            app.listen(PORT,()=>{
                console.log(`server is running on port ${PORT}`)
            })
    })
    .catch((error)=>{
        console.log(error)
    })