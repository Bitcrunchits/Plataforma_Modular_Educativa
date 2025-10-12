/** 
 * 
 * @param {Joi.Schema} schema El esquema de Joi a usar para la validación.
 * @param {('body'|'params'|'query')} property La propiedad de la petición a validar.
 * @returns {function} Un middleware de Express.
 */
export const validatorMiddleware = (schema, property) => {
    return (req, res, next) => {

        // 1. Validar la propiedad de la petición
        // La opción 'abortEarly: false' reporta todos los errores de validación a la vez.
        const { error, value } = schema.validate(req[property], { abortEarly: false });

        if (error) {
            // 2. Si hay errores, formatear la respuesta para el cliente
            const errorMessages = error.details.map(detail => ({
                field: detail.context.key,
                // Limpiamos las comillas que Joi añade por defecto a los mensajes
                message: detail.message.replace(/['"]/g, ''),
            }));

            // 3. Responder con un error 400 (Bad Request)
            return res.status(400).json({
                success: false,
                message: 'Error de validación de datos. Por favor, revise el formato de la solicitud.',
                errors: errorMessages,
            });
        }

        req[property] = value;

        next();
    };
};