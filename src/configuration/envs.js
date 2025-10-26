import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const envsSchema = joi.object({
    PORT: joi.number().default(3000),  // ← .default() en lugar de .required()
    DB_PORT: joi.number().default(3306),
    DB_HOST: joi.string().default('localhost'),
    DB_USER: joi.string().default('root'),
    DB_NAME: joi.string().default('escuela3'),
    DB_TYPE: joi.string().valid('mysql').default('mysql'),
    JWT_SECRET: joi.string().default('clave_secreta_temporal'),
    JWT_EXPIRY_TIME: joi.string().default('24h'),
}).unknown(true);

const { value: envsVar, error } = envsSchema.validate(process.env);
if (error) throw new Error(`Error de validación: ${error.message}`);

export const envs = envsVar;  // ← EXPORTAR DIRECTAMENTE envsVar