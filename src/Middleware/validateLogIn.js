import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import db from '../Config/database.js';

export async function validateLogIn(req, res, next) {

    const { email, password } = req.body;

    try {

        const user = await db.collection('users').findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).send('E-mail ou senha inválidos');

        const userToken = uuidV4();

        res.locals = { userToken, user };

        next();

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

}