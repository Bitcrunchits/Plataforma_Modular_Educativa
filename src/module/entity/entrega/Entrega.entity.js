import { EntitySchema } from 'typeorm';

const EntregaEntity = new EntitySchema({
  name: 'Entrega',
  tableName: 'entregas',
  columns: {
    // ID: Automático e Incremental
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    fechaEntrega: {
      type: 'timestamp',
      createDate: true,
    },
    // URL del archivo de la Entrega (Requisito de Inyección de Archivos)
    archivoUrl: {
      type: 'varchar',
    },
    calificacion: {
      type: 'decimal',
      nullable: true,
    },
    // Claves foráneas (tipo 'int')
    usuarioId: {
        type: 'int',
    },
    tareaId: {
        type: 'int',
    },
  },
  relations: {
    usuario: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: true,
    },
    tarea: {
      target: 'Tarea',
      type: 'many-to-one',
      joinColumn: true,
    },
  },
});

export default EntregaEntity;