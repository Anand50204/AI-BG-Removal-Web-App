import 'dotenv/config';
import express from "express";
import cors from "cors";
import { connectDB } from "./config/mongodb.js";
import userRouter from './routes/userRoutes.js';


//  App Config 
const PORT = process.env.PORT || 4000
const app = express();
connectDB()


// Api routes
app.get('/', (req, res) => res.send("api working"))
app.use('/api/user', userRouter)

// middelware
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log("Server runing on port " + PORT);
})