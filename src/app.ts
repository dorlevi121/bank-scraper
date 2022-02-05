import express, { Request, Response } from "express";
import 'dotenv/config';


const app = express();

app.listen(process.env.PORT, async () => {
    console.log(process.env.PORT);
})