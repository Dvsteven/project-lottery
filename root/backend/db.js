require("dotenv").config();
const path = require("path");

let db;
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
    // DESARROLLO LOCAL: SQLite
    const sqlite3 = require("sqlite3").verbose();
    db = new sqlite3.Database(
        path.join(__dirname, "loteria.db"),
        (err) => {
            if (err) {
                console.log("Error SQLite:", err.message);
            } else {
                console.log("✅ SQLite OK (LOCAL)");
                initDBSQLite();
            }
        }
    );
} else {
    // PRODUCCIÓN RENDER: PostgreSQL
    const { Pool } = require("pg");
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    console.log("✅ PostgreSQL conectado (RENDER)");
    // Las tablas ya existen en Supabase, no las recreamos
}

function initDBSQLite() {
    db.run(`
        CREATE TABLE IF NOT EXISTS coincidencias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            placa TEXT,
            loteria TEXT,
            numero TEXT,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS resumen_diario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT,
            placa TEXT,
            coincidencias INTEGER,
            estado TEXT,
            detalle TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS placas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            placa TEXT UNIQUE
        )
    `);
}

module.exports = db;