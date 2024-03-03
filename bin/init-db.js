const mysql = require('mysql2/promise');
const {exec} = require("child_process");
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

async function initDB() {
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
            //check if database exists
            const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);

            if (rows.length > 0) {
                //database exists, ask user if they want to drop it and recreate it
                console.log('Database already exists. Do you want to drop it and recreate it?');
                console.log('This will delete all data in the database.');
                console.log('Type "yes" to continue or "no" to cancel.');

                process.stdin.setEncoding('utf8');
                process.stdin.resume(); // Resume stdin stream

                process.stdin.once('data', async (data) => {
                    if (data.trim() === 'yes') {
                        await connection.query(`DROP DATABASE ${process.env.DB_NAME}`);
                        console.log('Database dropped successfully.');

                        await secondStep(connection, process);
                    } else {
                        console.log('Database was not dropped.');

                        await secondStep(connection, process);
                    }
                });
            } else {
                await secondStep(connection, process);
            }


        } catch (error) {
            console.error('Error initializing the database:', error);
        }
    }

    await initDatabase();

    async function secondStep(connection, process) {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

        console.log('Database initialized successfully.');

        //run migrations
        const {exec} = require('child_process');
        exec('npx sequelize-cli db:migrate', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }


            //run seeders
            exec('npx sequelize-cli db:seed:all', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);

                process.exit();
            });
        });

        //process.exit();//
    }


}

module.exports = {
    initDB,
}

