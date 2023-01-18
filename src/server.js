import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';

dotenv.config();

const {DATABASE_URL, PORT} = process.env;

const mongoClient = new MongoClient(DATABASE_URL);
let db;

try {
    await mongoClient.connect()
    db = mongoClient.db()
} catch (error) {
    console.error(error)
    console.log('Deu zica na conexão com o banco de dados')
}

const app = express();

app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
    console.log('API iniciada');
});
