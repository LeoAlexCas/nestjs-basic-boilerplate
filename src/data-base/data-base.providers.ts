
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'task-managment',
        //autoLoadEntities: true, //Carga automatico las tablas con las entidaes nest
        synchronize: true, //maniene sincronizadas las entidades con la tabla
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
      });

      return dataSource.initialize();
    },
  },
];

// export const databaseProviders = [
//   {
//     provide: 'DATA_SOURCE',
//     useFactory: async () => {
//       const dataSource = new DataSource({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//         username: 'postgres',
//         password: 'postgres',
//         database: 'task-managment',
//         //autoLoadEntities: true, //Carga automatico las tablas con las entidaes nest
//         synchronize: true, //maniene sincronizadas las entidades con la tabla
//         entities: [
//             __dirname + '/../**/*.entity{.ts,.js}',
//         ],
//       });

//       return dataSource.initialize();
//     },
//   },
// ];