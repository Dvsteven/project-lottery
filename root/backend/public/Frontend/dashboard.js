async function cargarResumen() {
    try {
        const response = await fetch(
            "http://localhost:3000/resumen"
        );

        const datos = await response.json();

        console.log("📊 Resumen:", datos);

        if (!datos || datos.length === 0) {
            document.getElementById("resumen").innerHTML = "<p class='text-gray-500'>Sin datos registrados</p>";
            return;
        }

        let htmlResumen = "<ul class='space-y-2'>";

        datos.slice(0, 5).forEach(item => {
            const fecha = new Date(item.fecha).toLocaleDateString('es-ES');
            htmlResumen += `
                <li class="flex justify-between items-center border-b pb-2">
                    <span class="text-sm md:text-base">
                        <strong>${fecha}</strong>
                        <span class="text-gray-600 ml-2">${item.coincidencias || 0} coincidencias</span>
                    </span>
                    <span class="text-xs md:text-sm px-2 py-1 rounded-full ${item.estado === 'COINCIDENCIA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${item.estado || 'N/A'}
                    </span>
                </li>
            `;
        });

        htmlResumen += "</ul>";
        document.getElementById("resumen").innerHTML = htmlResumen;

    } catch (error) {
        console.error("Error cargando resumen:", error);
    }
}

async function cargarResultadosAnterior() {
    try {
        // Verificar si hay datos en cache
        const cache = localStorage.getItem('resultados-anterior-cache');
        const cacheTime = localStorage.getItem('resultados-anterior-time');
        const ahora = Date.now();
        const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

        let datos;

        // Si hay cache y no ha expirado, usarlo
        if (cache && cacheTime && (ahora - parseInt(cacheTime)) < CACHE_DURATION) {
            console.log("📅 Usando resultados del día anterior en caché");
            datos = JSON.parse(cache);
        } else {
            // Si no hay cache válido, hacer fetch
            console.log("📅 Cargando resultados del día anterior del servidor");
            const response = await fetch("http://localhost:3000/resultados-anterior");
            datos = await response.json();
            
            // Guardar en cache
            localStorage.setItem('resultados-anterior-cache', JSON.stringify(datos));
            localStorage.setItem('resultados-anterior-time', ahora.toString());
        }

        // Actualizar fecha
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        const fechaFormato = ayer.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById("fecha-anterior").textContent = fechaFormato.charAt(0).toUpperCase() + fechaFormato.slice(1);

        // Renderizar resultados
        if (!datos.resultados || datos.resultados.length === 0) {
            document.getElementById("resultados-anterior").innerHTML = 
                "<div class='text-center text-gray-500 col-span-2 md:col-span-4'>Sin resultados disponibles</div>";
            return;
        }

        let htmlResultados = "";
        datos.resultados.forEach(resultado => {
            htmlResultados += `
                <div class="bg-white rounded-lg p-4 shadow-sm border-t-4 border-blue-500 hover:shadow-md transition">
                    <div class="text-xs text-gray-500 font-semibold uppercase mb-2">
                        ${resultado.loteria}
                    </div>
                    <div class="text-2xl md:text-3xl font-bold text-blue-600">
                        ${resultado.numero}
                    </div>
                </div>
            `;
        });

        document.getElementById("resultados-anterior").innerHTML = htmlResultados;

    } catch (error) {
        console.error("Error cargando resultados del día anterior:", error);
        document.getElementById("resultados-anterior").innerHTML = 
            "<div class='text-center text-red-500 col-span-2 md:col-span-4'>Error al cargar resultados</div>";
    }
}

async function cargarDashboard() {
    try {

        const response = await fetch(
            "http://localhost:3000/dashboard"
        );

        const datos = await response.json();

        let html = "";

        datos.forEach(item => {
            const fecha = new Date(item.fecha).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            html += `
                <tr class="border-b hover:bg-slate-50 transition">
                    <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">
                        ${fecha}
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm text-blue-600">
                        ${item.placa}
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">
                        ${item.loteria}
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base font-bold text-purple-600">
                        ${item.numero}
                    </td>
                </tr>
            `;

        });

        document.getElementById("tabla").innerHTML = html || "<tr><td colspan='4' class='text-center py-4 text-gray-500'>Sin resultados</td></tr>";

        document.getElementById("total").innerText = datos.length;

        await cargarResumen();

    } catch (error) {

        console.error("Error cargando dashboard:", error);

    }
}

// Cargar al iniciar
cargarDashboard();
cargarResultadosAnterior(); // Cargar resultados del día anterior al iniciar

// Actualizar dashboard cada 10 segundos
setInterval(cargarDashboard, 10000);

// Actualizar resultados del día anterior cada 6 horas (solo si el cache ha expirado)
setInterval(cargarResultadosAnterior, 6 * 60 * 60 * 1000); // 6 horas