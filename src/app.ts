import express, { Request, Response } from "express";
const http = require('http');
import 'dotenv/config';
import authRoutes from './routes/auth.route';
import bankRoutes from './routes/bank.route';
import { startSocket } from "./socket/socket";

const app = express();
app.use(express.json());

const server = http.createServer(app);

// Routes
app.use('/auth', authRoutes);
app.use('/bank', bankRoutes);
// app.use('/health/aws/check', (req, res) => {
//     return res.status(200);
// });

startSocket(server);


server.listen(process.env.PORT, async () => {
    console.log("Port: " + process.env.PORT);
})