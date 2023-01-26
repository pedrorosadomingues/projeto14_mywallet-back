import db  from '../Config/database.js';

export async function validateSession(req, res, next) {

    const { Authorization } = req.headers;

    const token = Authorization?.replace("Bearer ", "")

    try {
        
        const session = await db.collection('sessions').findOne({ token });

        if (!session) return res.status(401).send('Token inválido');

        res.locals = { session };

        next();

    } catch (error) {
        
        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

}