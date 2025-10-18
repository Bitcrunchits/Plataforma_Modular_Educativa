import { EntitySchema } from 'typeorm';

const TareaEntity = new EntitySchema({
    name: 'Tarea',
    tableName: 'tareas',
    columns: {
        // ID: Automático e Incremental
        id: {
            primary: true,
            type: 'int',
            generated: 'increment',
        },
        titulo: {
            type: 'varchar',
        },
        instrucciones: {
            type: 'text',
        },
        // Fechas de la Tarea (todas tipo Date)
        fechaInicio: {
            type: 'date',
        },
        fechaEntrega: {
            type: 'date',
        },
        fechaLimite: {
            type: 'date',
        },
        
        // CAMPO DE ARCHIVO ADJUNTO (Requisito de Inyección de Archivos)
        archivoAdjuntoUrl: {
            type: 'varchar',
            nullable: true, // La tarea puede no tener archivo
        },

        // Clave foránea a Materia (tipo 'int' para coincidir con el ID)
        materiaId: {
            type: 'int',
        },
    },
    relations: { 
        materia: {
            target: 'Materia',
            type: 'many-to-one',
            joinColumn: true,
            inverseSide: 'tareas',
        },
        entregas: {
            target: 'Entrega',
            type: 'one-to-many',
            inverseSide: 'tarea',
        },
    },
});

export default TareaEntity;