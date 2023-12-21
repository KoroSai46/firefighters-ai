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

function initDB() {
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
        }
    }

    initDatabase().then(r => console.log(r));

    //run migrations
    const { exec } = require('child_process');
    const migrateScript = exec('npx sequelize-cli db:migrate', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });

    migrateScript.stdin.end();


    //run seeders
    const seedScript = exec('npx sequelize-cli db:seed:all', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    seedScript.stdin.end();
}

module.exports = {
    initDB,
}

