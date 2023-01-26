import db from '../Config/database.js'
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

export async function newEntry(req, res) {

    const { description, value, type } = req.body;

    let value2 = value * 100;

    const { session } = res.locals;

    try {

        await db.collection('extract').insertOne({ description, value: value2, type, userId: session.userId, date: dayjs().format('DD/MM') });

        res.sendStatus(201);

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
}

export async function newExit(req, res) {

    const { description, value, type } = req.body;

    const { session } = res.locals;

    let value2 = value * 100;

    try {

        await db.collection('extract').insertOne({ description, value: value2, type, userId: session.userId, date: dayjs().format('DD/MM') });

        res.sendStatus(201);

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }
}

export async function getExtract(req, res) {

    const { session } = res.locals;

    try {

        const transacts = await db.collection('extract').find({ userId: session.userId }).toArray();

        let total = 0;

        transacts.forEach((t) => {

            if (t.type === 'entry') {

                total += t.value;

            } else {

                total -= t.value;

            }

        });   

        res.send({transacts, total});

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

}

export async function deleteTransact(req, res) {

    const { id } = req.params;

    try {

        await db.collection('extract').deleteOne({ _id: ObjectId(id) });

        res.sendStatus(200);

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro no servidor!');

    }

}