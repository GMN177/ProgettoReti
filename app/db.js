const pgp = require("pg-promise")();

const cn = {
    host: process.env.DB_HOST,
    port: 5432,
    database: 'progetto_reti',
    user: 'postgres',
    password: process.env.DB_PW
};

const db = pgp(cn);

module.exports = db