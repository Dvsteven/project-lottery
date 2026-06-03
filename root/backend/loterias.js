const axios = require("axios");
const cheerio = require("cheerio");

async function obtenerResultados(){
    try {
        // Intenta obtener de loteriasdehoy.co
        const respuesta = await axios.get(
            "https://loteriasdehoy.co/",
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 5000
            }
        );

        const $ = cheerio.load(respuesta.data);
        const resultados = [];

        // Extrae los números de las loterias
        // Busca patrones como "Risaralda: 022", "Meta: 220", etc
        const texto = $("body").text();
        
        // Loterias comunes en Colombia
        const loterias = [
            { nombre: "Risaralda", regex: /risaralda[:\s]+(\d{3})/gi },
            { nombre: "Meta", regex: /meta[:\s]+(\d{3})/gi },
            { nombre: "Cauca", regex: /cauca[:\s]+(\d{3})/gi },
            { nombre: "Magdalena", regex: /magdalena[:\s]+(\d{3})/gi },
            { nombre: "Tolima", regex: /tolima[:\s]+(\d{3})/gi },
            { nombre: "Huila", regex: /huila[:\s]+(\d{3})/gi }
        ];

        for (const loteria of loterias) {
            const match = texto.match(loteria.regex);
            if (match) {
                resultados.push({
                    loteria: loteria.nombre,
                    numero: match[1],
                    fecha: new Date().toISOString()
                });
            }
        }

        if (resultados.length > 0) {
            console.log("✅ Resultados obtenidos:", resultados.length);
            return resultados;
        }

        console.log("⚠️ No se encontraron resultados en la página");
        return [];

    } catch (err) {
        console.log("⚠️ Error en obtenerResultados:", err.message);
        // Devuelve datos de ejemplo si falla
        return [];
    }
}

// Función auxiliar para obtener resultados del día anterior (simulado)
async function obtenerResultadosDiaAnterior() {
    try {
        // En una versión real, esto consultaría una API o BD histórica
        // Por ahora devuelve datos simulados del día anterior
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);

        return [
            {
                loteria: "Risaralda",
                numero: "745",
                fecha: ayer.toISOString().split('T')[0]
            },
            {
                loteria: "Meta",
                numero: "321",
                fecha: ayer.toISOString().split('T')[0]
            },
            {
                loteria: "Cauca",
                numero: "888",
                fecha: ayer.toISOString().split('T')[0]
            },
            {
                loteria: "Magdalena",
                numero: "456",
                fecha: ayer.toISOString().split('T')[0]
            }
        ];
    } catch (err) {
        console.log("Error obteniendo resultados del día anterior:", err.message);
        return [];
    }
}

module.exports = {
    obtenerResultados,
    obtenerResultadosDiaAnterior
};