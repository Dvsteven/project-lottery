// Script para insertar datos de prueba
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "loteria.db"),
    (err) => {
        if (err) {
            console.log("Error:", err.message);
            process.exit(1);
        } else {
            console.log("✅ Conectado a SQLite");
            insertarDatosPrueba();
        }
    }
);

function insertarDatosPrueba() {
    // Insertar registros de prueba en coincidencias
    const ahora = new Date().toISOString();
    
    db.run(
        `INSERT INTO coincidencias (placa, loteria, numero, fecha)
         VALUES (?, ?, ?, ?)`,
        ["HGS22E", "Risaralda", "022", ahora],
        function(err) {
            if (err) {
                console.log("❌ Error inserting:", err.message);
            } else {
                console.log("✅ Registro 1 insertado (022)");
            }
        }
    );

    db.run(
        `INSERT INTO coincidencias (placa, loteria, numero, fecha)
         VALUES (?, ?, ?, ?)`,
        ["HGS22E", "Meta", "220", ahora],
        function(err) {
            if (err) {
                console.log("❌ Error inserting:", err.message);
            } else {
                console.log("✅ Registro 2 insertado (220)");
            }
        }
    );

    db.run(
        `INSERT INTO coincidencias (placa, loteria, numero, fecha)
         VALUES (?, ?, ?, ?)`,
        ["HGS22E", "Cauca", "22", ahora],
        function(err) {
            if (err) {
                console.log("❌ Error inserting:", err.message);
            } else {
                console.log("✅ Registro 3 insertado (22)");
            }
        }
    );

    // Insertar resumen diario
    const hoy = new Date().toISOString().split("T")[0];
    
    db.run(
        `INSERT INTO resumen_diario (fecha, placa, coincidencias, estado, detalle)
         VALUES (?, ?, ?, ?, ?)`,
        [hoy, "HGS22E", 3, "COINCIDENCIAS", JSON.stringify([
            { numero: "022", loteria: "Risaralda" },
            { numero: "220", loteria: "Meta" },
            { numero: "22", loteria: "Cauca" }
        ])],
        function(err) {
            if (err) {
                console.log("❌ Error inserting resumen:", err.message);
            } else {
                console.log("✅ Resumen diario insertado");
            }
        }
    );

    // Cerrar después de 2 segundos
    setTimeout(() => {
        console.log("\n🎉 Datos de prueba insertados correctamente");
        console.log("📊 Ve a http://localhost:3000 para ver los datos");
        db.close();
        process.exit(0);
    }, 2000);
}
