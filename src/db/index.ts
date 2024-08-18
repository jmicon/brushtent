import {Pool} from "pg"

// Creates a global connection pool
const pool = new Pool();

export default pool;
