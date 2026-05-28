const db = require("./db");
const { obtenerResultados } = require("./loterias");
const { enviarAlerta } = require("./telegram");

function generarNumeros(placa) {
    let n = placa.replace(/\D/g, '');

    if (!n) return [];

    return [
        n,
        n.split('').reverse().join(''),
        n.padStart(3, '0'),
        n.padEnd(3, '0')
    ];
}

async function revisar() {
    console.log("🔎 Revisando sorteos...");

    let resultados = await obtenerResultados();

    db.all("SELECT * FROM placas", (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }

        rows.forEach(p => {
            let numeros = generarNumeros(p.placa);

            resultados.forEach(r => {
                if (numeros.includes(r.numero)) {
                    console.log("🚨 COINCIDENCIA:", p.placa, r);

                    db.run(
                        `INSERT OR IGNORE INTO coincidencias
                        (placa, loteria, numero)
                        VALUES (?,?,?)`,
                        [p.placa, r.loteria, r.numero],
                        function(err) {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            if (this.changes > 0) {
                                console.log("🚨 Nueva coincidencia");

                                enviarAlerta(
                                    `🚨 COINCIDENCIA

Placa: ${p.placa}
Lotería: ${r.loteria}
Número: ${r.numero}`
                                );
                            }
                        }
                    );
                }
            });
        });
    });
}

module.exports = { revisar };