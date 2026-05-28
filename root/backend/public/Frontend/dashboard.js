async function cargarResumen() {
    try {
        const response = await fetch(
            "http://localhost:3000/resumen"
        );

        const datos = await response.json();

        console.log("📊 Resumen:", datos);

        let htmlResumen = "";

        datos.forEach(item => {
            htmlResumen += `
                <li class="flex justify-between border-b py-2">
                    <span>${item.loteria ?? "Sin lotería"}</span>
                    <span class="font-semibold">
                        ${item.total ?? item.coincidencias ?? 0}
                    </span>
                </li>
            `;
        });

        document.getElementById(
            "resumen"
        ).innerHTML = htmlResumen;

    } catch (error) {
        console.error(
            "Error cargando resumen:",
            error
        );
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

            html += `
                <tr class="border-b hover:bg-slate-50">

                    <td class="p-3">
                        ${item.fecha ?? "-"}
                    </td>

                    <td class="p-3 font-medium">
                        ${item.placa}
                    </td>

                    <td class="p-3">
                        ${item.loteria}
                    </td>

                    <td class="p-3">
                        ${item.numero}
                    </td>

                </tr>
            `;

        });

        document.getElementById(
            "tabla"
        ).innerHTML = html;

        document.getElementById(
            "total"
        ).innerText = datos.length;

        await cargarResumen();

    } catch (error) {

        console.error(
            "Error cargando dashboard:",
            error
        );

    }
}

cargarDashboard();

setInterval(
    cargarDashboard,
    10000
);