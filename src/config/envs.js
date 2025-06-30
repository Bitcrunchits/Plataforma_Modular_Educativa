import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config( { patch: './src/config/.env' } ); //cargamos las variables de entorno desde el archivo .env

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DB_PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    // DB_PASSWORD: joi.string().required(),
    DATABASE: joi.string().required(),
  })

  .unknown(true); // que me traiga las variables desconocidas..IMPORTANTE

  //!proceso de validacion de las variables de entorno
const { value: envsVar, error } = envsSchema.validate(process.env); //proccess. env contiene todas las variables

if (error) throw new Error(`Config validation error: ${error.message}`);

export const envs = {
  PORT: envsVar.PORT,
  DB_PORT: envsVar.DB_PORT,
  DB_HOST: envsVar.DB_HOST,
  DB_USER: envsVar.DB_USER,
  // DB_PASSWORD: envsVar.DB_PASSWORD,
  DATABASE: envsVar.DATABASE
};