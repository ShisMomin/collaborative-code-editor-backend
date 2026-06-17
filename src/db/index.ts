import { drizzle } from 'drizzle-orm/node-postgres';

// console.log(process.env.DATABASE_URL);
export const db = drizzle({
    connection: {
        connectionString: process.env.DATABASE_URL!,
        ssl: false, // false for development
    },
    casing: 'snake_case', // It automatically maps JavaScript camelCase fields to PostgreSQL snake_case columns
});
// db.

// async function connectDB() {
//     try {
//         console.log('Database connected');
//         await db.execute('select 1');
//         // await db.execute('select 1')
//         console.log(db);
//     } catch (err) {
//         console.error(err);
//     }
// }

// // console.log('runn');
// setTimeout(() => {
//     connectDB();
// }, 1000);
