import { Router } from 'express';
import { signUp, signIn } from '../Controller/auth.js';
import { userSchema } from '../Schema/authSchema.js';
import { validateSchema } from '../Middleware/validateSchema.js';
import { validateEmail } from '../Middleware/validateEmail.js';
import { validateLogIn } from '../Middleware/validateLogIn.js';

const authRouter = Router();

authRouter.post('/sign-up', validateSchema(userSchema), validateEmail ,signUp);
authRouter.post('/sign-in', validateLogIn, signIn);

export default authRouter;