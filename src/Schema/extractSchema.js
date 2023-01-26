import joi from 'joi';

export const transactSchema = joi.object({
   
    value: joi.number().required(),
   
    description: joi.string().required(),
   
    type: joi.string().required().valid('entry', 'exit')
});

