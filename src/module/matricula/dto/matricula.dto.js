export const CreateMatriculaDto = {
    /**
     * @property {number} id_usuario - ID del usuario (estudiante) que realiza la matrícula. Obligatorio.
     */
    id_usuario: null, 

    /**
     * @property {number} id_materia - ID de la materia (curso) a la que el usuario se está matriculando. Obligatorio.
     */
    id_materia: null,

    /**
     * @property {('activa'|'inactiva'|'finalizada')} [estado] - Estado inicial de la matrícula. Opcional.
     */
    estado: 'activa' 
};
