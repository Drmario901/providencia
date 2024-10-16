let vehicleTypes = []; 

function fetchSelectModal() {
    const vehicleTypeSelect = $("#vehicleType");
    vehicleTypeSelect.empty(); 

    vehicleTypes.sort(function(a, b) {
        return a.vehiculo.localeCompare(b.vehiculo);
    });

    vehicleTypes.forEach(function(vehicle) {
        vehicleTypeSelect.append(new Option(vehicle.vehiculo, vehicle.vehiculo)); 
    });
}

    let dataTable;
    let isModalOpen = false; 

    function initializeDataTable(data) {
        if (dataTable) {
            dataTable.destroy();
        }

        dataTable = new simpleDatatables.DataTable("#default-table", {
            data: {
                headings: ["Almacén", "Tipo", "Código", "Descripción", "Und. Medida", "Cantidad"],
                data: data
            },
            perPage: 5,
            perPageSelect: [5, 10]
        });

        bindRowClickEvent();
        dataTable.on('datatable.page', bindRowClickEvent);
        dataTable.on('datatable.perpage', bindRowClickEvent);
    }

    function bindRowClickEvent() {
        $("#default-table tbody").off("click", "tr").on("click", "tr", function() {
            if (isModalOpen) return; 

            const cells = $(this).find('td').map(function() {
                return $(this).text().trim();
            }).get();

            if (cells.length >= 6) {
                fetchLotDetails(cells);
            }
        });
    }
