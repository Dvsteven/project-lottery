const axios = require("axios");
const cheerio = require("cheerio");

async function obtenerResultados(){

try{

const respuesta =
await axios.get(
"https://loteriasdehoy.co/"
);

const $ =
cheerio.load(
respuesta.data
);

let texto =
$("body")
.text()
.replace(/\s+/g,' ')
.trim();

let indice =
texto.toLowerCase()
.indexOf(
"risaralda"
);

if(indice!==-1){

let inicio =
Math.max(
0,
indice-300
);

let fin =
indice+700;

console.log(
texto.substring(
inicio,
fin
)
);

}else{

console.log(
"No apareció Risaralda"
);

}

return [];

}
catch(err){

console.log(
err.message
);

return [];

}

}

module.exports={
obtenerResultados
};