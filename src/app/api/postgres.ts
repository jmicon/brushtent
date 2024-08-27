// Neon serverless database connection

// import { neon } from '@neondatabase/serverless';
// const sql = neon(process.env.DATABASE_URL!);

// _____________________________________________
// Neon regular database connection

import postgres from 'postgres'

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = postgres({
      host: PGHOST,
      database: PGDATABASE,
      username: PGUSER,
      password: PGPASSWORD,
      port: 5432,
      ssl: 'require',
    });
    
    // _____________________________________________
    // Local postgres database connection
    
// import postgres from 'postgres'

// const sql = postgres({
//     host: process.env.DATABASE_HOST,
//     port: Number(process.env.DATABASE_PORT), // PostgreSQL default port
//     username: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME
// }) 

export default sql