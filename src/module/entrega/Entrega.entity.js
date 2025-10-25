
import { EntitySchema } from 'typeorm';

const EntregaEntity = new EntitySchema({
    name: 'Entrega',
    tableName: 'entregas',
    columns: {
        id: {
            name: 'id_entrega', // Renombrado a id_entrega (PK)
            type: 'int',
            primary: true,
            generated: true,
        },
        fecha_entrega: { // Fecha en que el alumno hizo la entrega
            type: 'timestamp',
            createDate: true,
        },
        calificacion: {
            type: 'decimal',
            precision: 5,
            scale: 2,
            nullable: true, // Puede ser null si aún no se ha calificado
        },
        comentario: {
            type: 'text',
            nullable: true, // Comentario del profesor al calificar
        },
        
        // Claves Foráneas
        id_tarea: {
            type: 'int',
            nullable: false, // Una entrega siempre debe estar asociada a una tarea
        },
        id_usuario: {
            type: 'int',
            nullable: false, 
        },

        updatedAt: {
            type: 'timestamp',
            updateDate: true,
        },
    },
    relations: {
        // Relación con Tarea (Una Entrega es para UNA Tarea)
        tarea: {
            type: 'many-to-one',
            target: 'Tarea',
            // ¡CORRECCIÓN CLAVE! Referenciamos la PROPIEDAD 'id' de la entidad Tarea
            joinColumn: { name: 'id_tarea', referencedColumnName: 'id' }, 
            onDelete: 'CASCADE',
        },
        // Relación con Usuario (Un alumno hace UNA Entrega)
        alumno: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'id_usuario', referencedColumnName: 'id_usuario' },
            onDelete: 'CASCADE',
        },
    },
});

export default EntregaEntity;
