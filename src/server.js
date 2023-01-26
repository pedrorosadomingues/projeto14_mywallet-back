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

const port = process.env.PORT || 5000;

app.listen(port, () => {

    console.log('Server running in PORT: ' + port);

});
