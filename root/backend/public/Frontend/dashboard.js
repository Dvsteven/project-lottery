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

// Actualizar cada 10 segundos
setInterval(cargarDashboard, 10000);