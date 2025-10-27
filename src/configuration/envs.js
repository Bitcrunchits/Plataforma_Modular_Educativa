import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config( { patch: './.env' } ); //cargamos las variables de entorno desde el archivo .env

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DB_PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    // DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_TYPE: joi.string().valid('mysql').required(),
    // JWT_SECRET: joi.string().required(),
    JWT_EXPIRY_TIME: joi.string().required(),

    ENABLE_AUTH_BYPASS: joi.string()
      .default('false') 
      .description('Activa/Desactiva el bypass de autenticación. Debe ser "true" o "false".'),
  })

  .unknown(true); // que me traiga las variables desconocidas..IMPORTANTE

  //!proceso de validacion de las variables de entorno
const { value: envsVar, error } = envsSchema.validate(process.env); //proccess. env contiene todas las variables

if (error) throw new Error(`Error de validación variables entorno: ${error.message}`);

export const envs = {
  PORT: envsVar.PORT,
  DB_PORT: envsVar.DB_PORT,
  DB_HOST: envsVar.DB_HOST,
  DB_USER: envsVar.DB_USER,
  // DB_PASSWORD: envsVar.DB_PASSWORD,
  DB_NAME: envsVar.DB_NAME,
  DB_TYPE: envsVar.DB_TYPE,
  JWT_SECRET: envsVar.JWT_SECRET,
  JWT_EXPIRY_TIME: envsVar.JWT_EXPIRY_TIME,
   ENABLE_AUTH_BYPASS: envsVar.ENABLE_AUTH_BYPASS 
};