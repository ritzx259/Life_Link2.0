import mysql from 'mysql2/promise';

// Create a connection pool to the MySQL database
export async function getConnection() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root', // Replace with your MySQL username
      password: '', // Replace with your MySQL password
      database: 'lifelink',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    return pool;
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    throw error;
  }
}

// Helper function to execute SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}