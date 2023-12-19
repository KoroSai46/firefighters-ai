const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

async function initDatabase() {
    const connection = await mysql.createConnection(connectionConfig);

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        await connection.end();
    }
}

initDatabase().then(r => console.log(r));