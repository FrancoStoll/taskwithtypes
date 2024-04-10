import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from "./config/db"
import cors from 'cors'
import projectRoutes from './routes/project.routes'
import { corsConfig } from "./config/cors"
dotenv.config()
connectDB()
const app = express()
app.use(cors(corsConfig))
app.use(express.json())

//Routes
app.use('/api/projects', projectRoutes)





export default app