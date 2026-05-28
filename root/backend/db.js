require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

async function init() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS coincidencias (
            id SERIAL PRIMARY KEY,
            placa TEXT,
            loteria TEXT,
            numero TEXT,
            fecha TIMESTAMP DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS resumen_diario (
            id SERIAL PRIMARY KEY,
            fecha DATE,
            estado TEXT,
            detalle TEXT
        )
    `);

    console.log(
        "PostgreSQL OK"
    );

}

module.exports = {
    pool,
    init
};