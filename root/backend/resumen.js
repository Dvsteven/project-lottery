const db = require("./db");
const { enviarAlerta } = require("./telegram");

async function generarResumen(){

const hoy =
new Date()
.toISOString()
split("T")[0];

db.all(
`
SELECT *
FROM coincidencias
WHERE DATE(fecha)=?
`,
[hoy],
(err,rows)=>{

if(err){
console.log(err);
return;
}

let cantidad =
rows.length;

let estado =
cantidad>0
? "COINCIDENCIA"
: "SIN RESULTADOS";

let detalle =
cantidad>0
? JSON.stringify(rows)
: "No hubo coincidencias";

db.run(
`
INSERT INTO resumen_diario
(fecha,placa,coincidencias,estado,detalle)
VALUES (?,?,?,?,?)
`,
[
hoy,
"HGS22E",
cantidad,
estado,
detalle
]
);

if(cantidad>0){

enviarAlerta(
`🎯 RESUMEN DEL DÍA

Fecha:
${hoy}

Coincidencias:
${cantidad}

Estado:
${estado}`
);

}else{

enviarAlerta(
`📋 RESUMEN DEL DÍA

Fecha:
${hoy}

Placa:
HGS22E

Resultado:

No hubo coincidencias ni aproximaciones hoy.`
);

}

});

}

module.exports = {
generarResumen
};