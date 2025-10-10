import { EntitySchema } from 'typeorm';

const MatriculaEntity = new EntitySchema({
  name: 'Matricula',
  tableName: 'matriculas',
  columns: {
    // ID: Automático e Incremental
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    fechaInscripcion: {
      type: 'timestamp',
      createDate: true,
    },
    estado: {
      type: 'varchar',
      default: 'activa',
    },
    // Claves foráneas (tipo 'int')
    userId: {
        type: 'int',
    },
    materiaId: {
        type: 'int',
    }
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: true,
      inverseSide: 'matriculas',
    },
    materia: {
      target: 'Materia',
      type: 'many-to-one',
      joinColumn: true,
      inverseSide: 'matriculas',
    },
  },
});

export default MatriculaEntity;