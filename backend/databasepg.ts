import { Client, QueryResult } from 'pg';

const pool = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Buy@ppo7",
    database: "transcationDB",
});

async function fetchUsers(): Promise<void> {
    try {
        await pool.connect();
        const query = 'SELECT * FROM "Employee"';
        const result: QueryResult = await pool.query(query);
        console.log(result.rows);
    } catch (error) {
        console.error('Error executing query:', (error as Error).message);
    } finally {
        await pool.end();
    }
}

fetchUsers();
export {pool}

///here client is changed to pool


