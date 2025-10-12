import joi from 'joi';

//Esuqema de login
export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});