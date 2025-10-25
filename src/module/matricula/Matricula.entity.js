import { EntitySchema } from 'typeorm';

const MatriculaEntity = new EntitySchema({
  name: 'Matricula',
  tableName: 'matriculas',
  columns: {
    // ID: Automático e Incremental
    id_matricula: {
      name: 'id_matricula',
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    fecha_matricula: {
      type: 'timestamp',
      createDate: true,
    },
    estado: {
      type: 'varchar',
      default: 'activa',
    },
    // Claves foráneas (tipo 'int')
    id_usuario: {
      type: 'int',
      nullable: false,
    },
    id_materia: {
      type: 'int',
      nullable: false,
    }
  },
  relations: {
     estudiante: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'id_usuario', referencedColumnName: 'id_usuario' }, // Referencia la columna local
      inverseSide: 'matriculas',
    },
    materia: {
      target: 'Materia',
      type: 'many-to-one',
      joinColumn: { name: 'id_materia', referencedColumnName: 'id_materia' }, // Referencia la columna local
      inverseSide: 'matriculas',
    },
  },
  uniques: [{
    name: 'unique_user_materia',
    columns: ['id_usuario', 'id_materia'],
  }]
});

export default MatriculaEntity;