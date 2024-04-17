import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from "./config/db"
import cors from 'cors'
import projectRoutes from './routes/project.routes'
import authRoutes from './routes/auth.routes'
import { corsConfig } from "./config/cors"
import morgan from "morgan"
dotenv.config()
connectDB()
const app = express()
app.use(cors(corsConfig))
app.use(express.json())

//Loggin
app.use(morgan('dev'))

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)






export default app