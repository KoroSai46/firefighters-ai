const mysql = require('mysql2/promise');
require('dotenv').config();

mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}).then((connection) => {
    connection.prepare(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`)
        .then((statement) => {
            statement.execute(undefined)
                .then(() => {
                    console.log(`Database ${process.env.DB_NAME} created successfully.`);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    connection.end().then(r => console.log('Connection closed.'));
                });
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            console.log('Operation finished.');
        });

});

//exiting the process
process.exit();