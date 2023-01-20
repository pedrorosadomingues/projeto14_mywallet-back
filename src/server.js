import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

dotenv.config();

const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().pattern(/^[a-zA-Z0-9]{6,30}$/),
    confirmPassword: joi.ref('password')
});

const transactionSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required().valid('entry', 'exit')
});



const { DATABASE_URL, PORT } = process.env;

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

app.post('/sign-up', async (req, res) => {

    const { name, email, password, confirmPassword } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);

    const validation = userSchema.validate({ name, email, password, confirmPassword }, { abortEarly: false });

    if (validation.error) {

        const errorMessages = validation.error.details.map((error) => error.message);

        return res.status(422).send(errorMessages);
    }

    try {

        const isRegistered = await db.collection('users').findOne({ email });

        if (isRegistered) return res.status(409).send('E-mail já cadastrado');

        await db.collection('users').insertOne({ name, email, password: passwordHash });

        res.status(201).send('Usuário cadastrado com sucesso');

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
});

app.post('/sign-in', async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await db.collection('users').findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {

            const token = uuidV4();

            await db.collection('sessions').insertOne({ token, userId: user._id });

            res.status(200).send({ token, user });

        } else {

            res.status(401).send('E-mail ou senha inválidos');

        }

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
});

app.post('/new-entry', async (req, res) => {

    const { description, value, type } = req.body;

    const { authorization } = req.headers;

    const token = authorization.replace("Bearer ", "")

    const { error } = transactionSchema.validate({ description, value, type }, { abortEarly: false });

    if (error) {

        const errorMessages = error.details.map((error) => error.message);

        return res.status(422).send(errorMessages);
    }

    let value2 = value * 100;

    try {

        const session = await db.collection('sessions').findOne({ token });

        if (!session) return res.status(401).send('Token inválido');

        await db.collection('extract').insertOne({ description, value: value2, type, userId: session.userId, date: dayjs().format('DD/MM') });

        res.sendStatus(201);

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

});

app.post('/new-exit', async (req, res) => {


    const { description, value, type } = req.body;

    const { authorization } = req.headers;

    const token = authorization.replace("Bearer ", "")

    const { error } = transactionSchema.validate({ description, value, type }, { abortEarly: false });

    if (error) {

        const errorMessages = error.details.map((error) => error.message);

        return res.status(422).send(errorMessages);
    }

    let value2 = value * 100;

    try {

        const session = await db.collection('sessions').findOne({ token });

        if (!session) return res.status(401).send('Token inválido');

        await db.collection('extract').insertOne({ description, value: value2, type, userId: session.userId, date: dayjs().format('DD/MM') });

        res.sendStatus(201);

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

});

app.get('/extract', async (req, res) => {

    const { authorization } = req.headers;

    const token = authorization.replace("Bearer ", "")

    try {

        const session = await db.collection('sessions').findOne({ token });

        if (!session) return res.status(401).send('Token inválido');

        const transactions = await db.collection('extract').find({ userId: session.userId }).toArray();

        let total = 0;

        transactions.forEach((t) => {

            if (t.type === 'entry') {

                total += t.value;

            } else {

                total -= t.value;

            }

        });   

        res.send({transactions, total});

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
});

app.listen(PORT, () => {

    console.log('Server is running on PORT ' + PORT);

});
