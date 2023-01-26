import bcrypt from 'bcrypt'
import db from '../Config/database.js'

export async function signUp(req, res) {

    const { name, email, password } = req.body

    const passwordHash = bcrypt.hashSync(password, 10)

    try {

        await db.collection('users').insertOne({ name, email, password: passwordHash });

        res.status(201).send('Usuário cadastrado com sucesso');

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
}

export async function signIn(req, res) {

    const { userToken, user } = res.locals;


    try {

        await db.collection('sessions').insertOne({ userToken, userId: user._id });

        res.status(200).send({ userToken, user });

    }

    catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
}