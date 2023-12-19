const mysql = require('mysql2/promise');
require('dotenv').config();

//check for each env variable and throw error if not found
const requiredEnvVariables = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_PORT',
    'DB_DIALECT',
];

requiredEnvVariables.forEach(envVariable => {
    if (!process.env[envVariable]) {
        throw new Error(`Environment variable ${envVariable} is missing. Please check your .env file.`);
    }
});


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