import { EntitySchema } from 'typeorm';

const EntregaEntity = new EntitySchema({
    name: 'Entrega',
    tableName: 'entregas',
    columns: {
        
        id_entrega: {
            type: 'int',
            primary: true,
            generated: true,
        },
        
        // --- CAMPOS DE LA ENTREGA REALIZADA POR EL ALUMNO ---
        archivoAdjuntoUrl: { 
            name: 'archivo_adjunto_url',
            type: 'varchar',
            length: 500,
            nullable: false,
        },
        comentarioAlumno: { // Comentario opcional del alumno al entregar
            name: 'comentario_alumno',
            type: 'text',
            nullable: true, 
        },
        fechaEntrega: { // Fecha en que el alumno hizo la entrega
            name: 'fecha_entrega',
            type: 'timestamp',
            createDate: true,
        },
        
        // --- CAMPOS DE CALIFICACIÓN
        calificacion: {
            type: 'decimal',
            precision: 5,
            scale: 2,
            nullable: true, // Nulo hasta que el profesor califique
        },
        comentarioProfesor: { // Comentario/Feedback del profesor
            name: 'comentario_profesor',
            type: 'text',
            nullable: true, 
        },
        fechaCalificacion: { // Fecha en que se calificó
            name: 'fecha_calificacion',
            type: 'timestamp',
            nullable: true, 
        },

        // --- CLAVES FORÁNEAS 
        id_tarea: { // FK a Tarea
            type: 'int',
            nullable: false, 
        },
        id_alumno: { // FK al Usuario que hace la entrega
            type: 'int',
            nullable: false, 
        },
        id_profesor_calificador: { // FK al Usuario que califica
            type: 'int',
            nullable: true, // Es nulo hasta que se califica
        },

        // --- TIMESTAMPS AUTOMÁTICOS ---
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            updateDate: true,
        },
    },
    relations: {
        tarea: {
            type: 'many-to-one',
            target: 'Tarea',
            joinColumn: { name: 'id_tarea', referencedColumnName: 'id' }, 
            onDelete: 'CASCADE',
        },
        alumno: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'id_alumno', referencedColumnName: 'id_usuario' },
            onDelete: 'CASCADE',
        },
        profesorCalificador: { 
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'id_profesor_calificador', referencedColumnName: 'id_usuario' },
            onDelete: 'SET NULL', 
            nullable: true,
        },
    },
});

export default EntregaEntity;