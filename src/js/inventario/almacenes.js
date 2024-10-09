jQuery(document).ready(function($) {
    let dataTable;
    let modalTable;

    function initializeDataTable(data) {
        if (dataTable) {
            dataTable.destroy();
        }

        dataTable = new simpleDatatables.DataTable("#default-table", {
            data: {
                headings: ["Almacén", "Tipo", "Código", "Descripción", "Und. Medida", "Cantidad"],
                data: data
            },
            perPage: 10,
            perPageSelect: [10, 20, 30, 50]
        });

        bindRowClickEvent();
        dataTable.on('datatable.page', bindRowClickEvent);
    }

    function bindRowClickEvent() {
        $("#default-table tbody").off("click", "tr").on("click", "tr", function() {
            const cells = $(this).find('td').map(function() {
                return $(this).text().trim();
            }).get();

            if (cells.length >= 6) {
                fetchLotDetails(cells);
            }
        });
    }

    function formatDataForTable(data) {
        return data.map(item => [
            item.almacen || '',
            item.tipomateria || '',
            item.codigo || '',
            item.descripcion || '',
            item.unidadmedida || '',
            item.cantidad || ''
        ]);
    }

    function fetchInventoryData(almacen, fecha) {
        $.ajax({
            url: wb_subdir + '/php/inventario/inventario.php',
            type: "POST",
            data: {
                caso: 1,
                fecha: fecha,
                almacen: almacen
            },
            dataType: "JSON",
            success: function(response) {
                if (response.validar) {
                    const formattedData = formatDataForTable(response.data);
                    initializeDataTable(formattedData);
                } else {
                    initializeDataTable([]);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener los datos: " + error);
            }
        });
    }

    function fetchLotDetails(data) {
        const [almacen, tipo, codigo, descripcion, unidadMedida, cantidad] = data;

        $.ajax({
            url: wb_subdir + '/php/inventario/inventario.php',
            type: "POST",
            data: {
                caso: 2,
                codigoProd: codigo,
                fecha: $("#fecha-input").val()
            },
            dataType: "JSON",
            success: function(response) {
                if (response.validar) {
                    const lotesData = response.data.map(lote => [
                        lote.fecha,
                        lote.lote,
                        lote.codigo,
                        lote.cantidad,
                        lote.unidadmedida
                    ]);
                    showDetailsModal({ almacen, tipo, codigo, descripcion, unidadMedida, cantidad, lotesData });
                } else {
                    Swal.fire('Sin datos', 'No se encontraron lotes.', 'info');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener los detalles de los lotes: " + error);
            }
        });
    }

    function fetchLotHistory(codigo) {
        const fecha = $("#fecha-input").val();

        $.ajax({
            url: wb_subdir + '/php/inventario/inventario.php',
            type: "POST",
            data: {
                caso: 3,
                codigo: codigo,
                fecha: fecha
            },
            dataType: "JSON",
            success: function(response) {
                if (response.validar) {
                    const lotHistoryData = response.data.map(mov => [
                        mov.fecha,
                        mov.lote,
                        mov.codigo,
                        mov.entradas,
                        mov.salidas
                    ]);
                    showLotHistoryModal(codigo, lotHistoryData, response.totalEntradas, response.totalSalidas);
                } else {
                    Swal.fire('Sin datos', 'No se encontraron movimientos para este código.', 'info');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener los detalles generales del código: " + error);
            }
        });
    }

    function fetchSingleLotHistory(codigo, lote) {
        const fecha = $("#fecha-input").val();

        $.ajax({
            url: wb_subdir + '/php/inventario/inventario.php',
            type: "POST",
            data: {
                caso: 4,
                codigo: codigo,
                lote: lote,
                fecha: fecha
            },
            dataType: "JSON",
            success: function(response) {
                if (response.validar) {
                    const lotHistoryData = response.data.map(mov => [
                        mov.fecha,
                        mov.lote,
                        mov.codigo,
                        mov.entradas,
                        mov.salidas
                    ]);
                    showLotHistoryModal(lote, lotHistoryData, response.totalEntradas, response.totalSalidas);
                } else {
                    Swal.fire('Sin datos', 'No se encontraron movimientos para este lote.', 'info');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener los detalles del lote: " + error);
            }
        });
    }

    function showDetailsModal({ almacen, tipo, codigo, descripcion, unidadMedida, cantidad, lotesData }) {
        Swal.fire({
            title: 'Inventario por Lotes',
            html: `
                <div class="bg-white shadow-lg rounded-lg p-4">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium">Descripción</label>
                            <input type="text" value="${descripcion}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Código</label>
                            <input type="text" value="${codigo}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Tipo</label>
                            <input type="text" value="${tipo}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Cantidad Total</label>
                            <input type="text" value="${cantidad}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Unidad de Medida</label>
                            <input type="text" value="${unidadMedida}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" readonly>
                        </div>
                    </div>
                    <div class="text-center mb-4">
                        <button id="view-lot-history" class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Ver Detalle del Lote</button>
                    </div>
                    <div id="modal-lotes-table" class="min-w-full"></div>
                </div>
            `,
            width: 800,
            showConfirmButton: false,
            didOpen: () => {
                if (modalTable) {
                    modalTable.destroy();
                }
                modalTable = new simpleDatatables.DataTable("#modal-lotes-table", {
                    data: {
                        headings: ["Fecha", "Lote", "Código", "Cantidad", "Und. Medida"],
                        data: lotesData
                    },
                    perPage: 5,
                    perPageSelect: [5, 10, 20]
                });

                $("#view-lot-history").on("click", function() {
                    fetchLotHistory(codigo); 
                });

                $("#modal-lotes-table tbody").on("click", "tr", function() {
                    const selectedLote = $(this).find('td').eq(1).text().trim(); 
                    fetchSingleLotHistory(codigo, selectedLote);
                });
            }
        });
    }

    function showLotHistoryModal(lote, lotHistoryData, totalEntradas, totalSalidas) {
        Swal.fire({
            title: 'Detalle del Lote',
            html: `
                <div class="bg-white shadow-lg rounded-lg p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium">Lote</label>
                        <input type="text" value="${lote}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" readonly>
                    </div>
                    <div id="modal-history-table" class="min-w-full"></div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label class="block text-sm font-medium">Total Entradas</label>
                            <input type="text" value="${totalEntradas}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100 text-right" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Total Salidas</label>
                            <input type="text" value="${totalSalidas}" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100 text-right" readonly>
                        </div>
                    </div>
                </div>
            `,
            width: 800,
            showConfirmButton: false,
            didOpen: () => {
                if (modalTable) {
                    modalTable.destroy();
                }
                modalTable = new simpleDatatables.DataTable("#modal-history-table", {
                    data: {
                        headings: ["Fecha", "Lote", "Código", "Entradas", "Salidas"],
                        data: lotHistoryData
                    },
                    perPage: 5,
                    perPageSelect: [5, 10, 20]
                });
            }
        });
    }

    const today = new Date().toISOString().split('T')[0];
    $("#fecha-input").val(today);

    $("#almacen-select").on("change", function() {
        const almacen = $(this).val();
        const fecha = $("#fecha-input").val();
        fetchInventoryData(almacen, fecha);
    });

    $("#fecha-input").on("change", function() {
        const almacen = $("#almacen-select").val();
        const fecha = $(this).val();
        fetchInventoryData(almacen, fecha);
    });

    fetchInventoryData("", today);
});
