import db from '../Config/database.js'

export async function validateEmail(req, res, next) {

    const { email } = req.body;

    try {

        const isRegistered = await db.collection('users').findOne({ email });

        if (isRegistered) return res.status(409).send('E-mail já cadastrado');

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

    next();
    
}