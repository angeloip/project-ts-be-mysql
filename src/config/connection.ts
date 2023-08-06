import { Pool, PoolConnection, createPool } from 'mysql2/promise'

export const pool: Pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'storedb',
})


export const checkDBConnection = async (): Promise<void> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();
    console.log('Database connected successfully');
  } catch (err) {
    console.log('Error connecting to the database:', err);
  } finally {
    if (connection) connection.release()
  }
}