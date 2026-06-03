const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");
const { revisar } = require("./watchdog");
const { obtenerResultados } = require("./loterias");
const { enviarAlerta } = require("./telegram");
const { generarResumen } = require("./resumen");

const app = express();
app.use(
    express.static(
        path.join(__dirname, "public", "Frontend")
    )
);

app.use(cors());
app.use(express.json());

// 🔹 Función para generar números a partir de la placa
function generarNumeros(placa) {
    let n = placa.replace(/\D/g, "");
    if (!n) return [];

    return [
        n,
        n.split("").reverse().join(""),
        n.padStart(3, "0"),
        n.padEnd(3, "0")
    ];
}

// 🔹 Endpoint para consultar coincidencias en tiempo real
app.post("/consultar", async (req, res) => {
    let placa = req.body.placa;
    let numeros = generarNumeros(placa);

    let resultados = await obtenerResultados();

    let coincidencias = resultados.filter(r =>
        numeros.includes(r.numero)
    );

    coincidencias.forEach(c => {
        db.run(
            `INSERT OR IGNORE INTO coincidencias
            (placa, loteria, numero)
            VALUES (?,?,?)`,
            [placa, c.loteria, c.numero],
            function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (this.changes > 0) {
                    console.log("🚨 Nueva coincidencia");
                    enviarAlerta(
                        `🚨 COINCIDENCIA

Placa: ${placa}
Lotería: ${c.loteria}
Número: ${c.numero}`
                    );
                }
            }
        );
    });

    res.json({ placa, numeros, coincidencias });
});

// 🔹 Endpoint para agregar placa manualmente
app.post("/placa", (req, res) => {
    db.run("INSERT INTO placas (placa) VALUES (?)", [req.body.placa]);
    res.json({ ok: true });
});

// 🔹 Endpoint para consultar coincidencias guardadas
app.get("/coincidencias", (req, res) => {
    db.all("SELECT * FROM coincidencias ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// 🔹 Nuevo endpoint para dashboard (últimas 50 coincidencias)
app.get("/dashboard", (req, res) => {
    db.all(
        `
        SELECT
        placa,
        loteria,
        numero,
        fecha
        FROM coincidencias
        ORDER BY fecha DESC
        LIMIT 50
        `,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(rows);
        }
    );
});

// 🔹 Endpoint para obtener resumen diario
app.get("/resumen",(req,res)=>{

db.all(
`
SELECT *
FROM resumen_diario
ORDER BY fecha DESC
LIMIT 30
`,
[],
(err,rows)=>{

res.json(rows);

});

});


// 🔹 Servidor con CRON simple
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor OK en puerto ${PORT}`);

    // Cada 10 minutos ejecuta revisar()
    setInterval(() => {
        revisar();
    }, 1000 * 60 * 10);

    // Cada minuto revisa si son las 18:00 exactas
    setInterval(() => {
        let ahora = new Date();
        if (ahora.getHours() === 18 && ahora.getMinutes() === 0) {
            generarResumen();
        }
    }, 60000);
});