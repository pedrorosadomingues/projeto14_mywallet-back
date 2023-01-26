import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import extractRouter from './Routes/extractRouter.js';
import authRouter from './Routes/authRouter.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use([extractRouter, authRouter]);

app.listen(process.env.PORT, () => {

    console.log('Server is running on PORT ' + process.env.PORT);

});
