import express, { Request, Response } from "express";
import 'dotenv/config';
import authRoutes from './routes/auth.route';


const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/health/aws/check', (req, res) => {
    return res.status(200);
});


app.listen(process.env.PORT, async () => {
    console.log(process.env.PORT);
})