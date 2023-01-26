import joi from 'joi';

export const userSchema = joi.object({
    name: joi.string().pattern(/^[a-zA-Z]/).min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(6),
    confirmPassword: joi.ref('password')
});