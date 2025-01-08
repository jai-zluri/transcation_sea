import { Client, QueryResult } from 'pg';

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Buy@ppo7",
    database: "transcationDB",
});

async function fetchUsers(): Promise<void> {
    try {
        await client.connect();
        const query = 'SELECT * FROM "Employee"';
        const result: QueryResult = await client.query(query);
        console.log(result.rows);
    } catch (error) {
        console.error('Error executing query:', (error as Error).message);
    } finally {
        await client.end();
    }
}

fetchUsers();
