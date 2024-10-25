import * as Joi from '@hapi/joi'

//importando hapi/joi para hacer un validador de esquema
//hay que importar tambien los tipos porque no trae tipos en la libreria
//npm i @hapi/joi
//npm i -D @types/hapi__joi
export const configValidationSchema = Joi.object({
    STAGE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432).required(),
    DB_TYPE: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required()
});