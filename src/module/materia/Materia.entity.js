import { EntitySchema } from 'typeorm';

/**
 * Entidad de Materia (MateriaEntity).
 * Representa la tabla 'materias' en la base de datos.
 */
const MateriaEntity = new EntitySchema({
  name: 'Materia',
  tableName: 'materias',
  columns: {
    
    id_materia: {
      primary: true,
      type: 'int',
      generated: 'increment',
      name: 'id_materia', // Nombre explícito de la columna en MySQL
    },
    
    nom_materia: {
      type: 'varchar',
      unique: true,
      nullable: false, // Es obligatorio por DTO
    },
    descripcion: {
      type: 'text', // Soporta texto largo
      nullable: true, // Permitir nulo si no se envía
    },
    
    activo: {
        type: 'boolean',
        default: true,
    },
  },
  relations: {
    // RELACIÓN AÑADIDA: Materia pertenece a UN Profesor (Many-to-One con User)
    profesor: { 
        target: 'User', // Nombre de la Entidad del profesor
        type: 'many-to-one',
        // Esto crea la columna FK 'id_profesor' en la tabla 'materias'
        joinColumn: { name: 'id_profesor', referencedColumnName: 'id_usuario' }, 
        inverseSide: 'materias', // Propiedad en User.entity.js
        onDelete: 'SET NULL', // Si el profesor es eliminado, la materia queda sin asignar
        nullable: true, // Permitir que la FK sea nula (aunque el DTO lo requiere en la creación)
    },
    matriculas: {
      target: 'Matricula',
      type: 'one-to-many',
      inverseSide: 'id_materia',
    },
    tareas: {
      target: 'Tarea',
      type: 'one-to-many',
      inverseSide: 'materia',
    },
  },
});

export default MateriaEntity;