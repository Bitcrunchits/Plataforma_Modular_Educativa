
import { EntitySchema } from 'typeorm';


const TareaEntity = new EntitySchema({
    name: 'Tarea',
    tableName: 'tareas',
    columns: {
        // ID: Automático e Incremental (PK)
        id: {
            name: 'id_tarea',
            primary: true,
            type: 'int',
            generated: 'increment',
        },
        titulo: {
            type: 'varchar',
            nullable: false,
        },
        
        descripcion: {
            type: 'text',
            nullable: false, 
        },
        
        
        fecha_entrega: {
            type: 'timestamp',
            nullable: false,
        },
        
        
        id_materia: {
            type: 'int',
            nullable: false, 
        },
        
        
        archivoAdjuntoUrl: {
            type: 'varchar',
            nullable: true, 
        },

        
        createdAt: {
            name: 'createdAt',
            type: 'timestamp',
            createDate: true,
        },
        updatedAt: {
            name: 'updatedAt',
            type: 'timestamp',
            updateDate: true,
        },
    },
    relations: { 
        materia: {
            target: 'Materia',
            type: 'many-to-one',
            // El joinColumn debe referenciar la PK de Materia, que es id_materia
            joinColumn: { name: 'id_materia', referencedColumnName: 'id_materia' },
            inverseSide: 'tareas',
            onDelete: 'CASCADE',
        },
        entregas: {
            target: 'Entrega',
            type: 'one-to-many',
            // El campo que referencia TypeORM en Entrega es 'tarea'
            inverseSide: 'tarea',
        },
    },
});

export default TareaEntity;
