import { EntitySchema } from 'typeorm';

const MateriaEntity = new EntitySchema({
  name: 'Materia',
  tableName: 'materias',
  columns: {
    // ID: Automático e Incremental
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    nombre: {
      type: 'varchar',
      unique: true,
    },
    descripcion: {
      type: 'text', // Soporta texto largo
    },
  },
  relations: {
    matriculas: {
      target: 'Matricula',
      type: 'one-to-many',
      inverseSide: 'materia',
    },
    tareas: {
      target: 'Tarea',
      type: 'one-to-many',
      inverseSide: 'materia',
    },
  },
});

export default MateriaEntity;