let vehicleTypes = []; 

function fetchVehiclesData() {
    $.ajax({
        url: wb_subdir + '/php/vehiculos/optionsVehiculos.php', 
        type: 'POST',
        data: {},
        dataType: 'JSON',
        success: function(response) {
            //console.log(response);
            vehicleTypes = response.data; 
            fetchSelectModal(); 
        },
        error: function(xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
fetchVehiclesData();

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


jQuery(document).ready(function($) {
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

    // function fetchInventoryData(almacen, fecha) {
    //     $.ajax({
    //         url: wb_subdir + '/php/inventario/inventario.php',
    //         type: "POST",
    //         data: {
    //             caso: 1,
    //             fecha: fecha,
    //             almacen: almacen
    //         },
    //         dataType: "JSON",
    //         success: function(response) {
    //             if (response.validar) {
    //                 const formattedData = formatDataForTable(response.data);
    //                 initializeDataTable(formattedData);
    //             } else {
    //                 initializeDataTable([]);
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error("Error al obtener los datos: " + error);
    //         }
    //     });
    // }

    $('#searchPlateBtn').on('click', function() {
        Swal.fire({
            title: 'Registrar nueva placa',
            html:
                `<div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <form id="newVehicleForm" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label for="plate" class="block text-sm font-medium text-gray-700">Placa</label>
                                <input type="text" id="plate" name="plate" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese la placa" required>
                            </div>
                            <div>
                                <label for="vehicleType" class="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
                                <select id="vehicleType" name="vehicleType" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                                    <option value="">Seleccione un elemento</option>
                                </select>
                            </div>
                            <div>
                                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacidad (Toneladas)</label>
                                <input type="number" step="0.01" id="capacity" name="capacity" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" required>
                            </div>
                            <div>
                                <label for="taraWeight" class="block text-sm font-medium text-gray-700">Peso Tara</label>
                                <input type="number" step="0.01" id="taraWeight" name="taraWeight" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" required>
                            </div>
                            <div>
                                <label for="cubicMeters" class="block text-sm font-medium text-gray-700">Metros Cúbicos</label>
                                <input type="number" step="0.01" id="cubicMeters" name="cubicMeters" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                            </div>
                            <div>
                                <label for="insuranceExpiry" class="block text-sm font-medium text-gray-700">Vencimiento Seguro</label>
                                <input type="date" id="insuranceExpiry" name="insuranceExpiry" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                            </div>
                            <div>
                                <label for="permitExpiry" class="block text-sm font-medium text-gray-700">Vencimiento Permiso Circulación</label>
                                <input type="date" id="permitExpiry" name="permitExpiry" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                            </div>
                        </div>
                        <div>
                            <label for="comments" class="block text-sm font-medium text-gray-700">Comentarios</label>
                            <textarea id="comments" name="comments" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100"></textarea>
                        </div>
                        <div class="text-center mt-4">
                            <button type="submit" id="register-vehicle" class="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Registrar</button>
                        </div>
                    </form>
                </div>`,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });

                fetchSelectModal();

                $("#register-vehicle").on("click", function(e) {
                    e.preventDefault(); 
                    const form = document.getElementById('newVehicleForm');
                    const formData = new FormData(form);

                    const data = {
                        plate: formData.get('plate'),
                        vehicleType: formData.get('vehicleType'),
                        capacity: formData.get('capacity'),
                        taraWeight: formData.get('taraWeight'),
                        cubicMeters: formData.get('cubicMeters'),
                        insuranceExpiry: formData.get('insuranceExpiry'),
                        permitExpiry: formData.get('permitExpiry'),
                        comments: formData.get('comments')
                    };

                    console.log(data);
                });
            }
        });
    });

    $('#registerDriver').on('click', function() {
        Swal.fire({
            title: 'Registrar nuevo conductor',
            html:
                `<div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <form id="newDriverForm" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label for="driverName" class="block text-sm font-medium text-gray-700">Nombre del Conductor</label>
                                <input type="text" id="driverName" name="driverName" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese el nombre" required>
                            </div>
                            <div>
                                <label for="idCard" class="block text-sm font-medium text-gray-700">Cédula</label>
                                <input type="text" id="idCard" name="idCard" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese la cédula" required>
                            </div>
                            <div>
                                <label for="license" class="block text-sm font-medium text-gray-700">Licencia de Conducir</label>
                                <input type="text" id="license" name="license" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Número de licencia" required>
                            </div>
                            <div>
                                <label for="licenseExpiry" class="block text-sm font-medium text-gray-700">Vencimiento de Licencia</label>
                                <input type="date" id="licenseExpiry" name="licenseExpiry" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" required>
                            </div>
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input type="tel" id="phone" name="phone" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Número de teléfono">
                            </div>
                            <div>
                                <label for="address" class="block text-sm font-medium text-gray-700">Dirección</label>
                                <input type="text" id="address" name="address" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese la dirección">
                            </div>
                        </div>
                        <div>
                            <label for="comments" class="block text-sm font-medium text-gray-700">Comentarios</label>
                            <textarea id="comments" name="comments" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100"></textarea>
                        </div>
                        <div class="text-center mt-4">
                            <button type="submit" id="register-driver" class="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Registrar</button>
                        </div>
                    </form>
                </div>`,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });
    
                $("#register-driver").on("click", function(e) {
                    e.preventDefault(); 
                    const form = document.getElementById('newDriverForm');
                    const formData = new FormData(form);
    
                    const data = {
                        driverName: formData.get('driverName'),
                        idCard: formData.get('idCard'),
                        license: formData.get('license'),
                        licenseExpiry: formData.get('licenseExpiry'),
                        phone: formData.get('phone'),
                        address: formData.get('address'),
                        comments: formData.get('comments')
                    };
    
                    console.log(data);
                });
            }
        });
    });
    

    // const today = new Date().toISOString().split('T')[0];
    // $("#fecha-input").val(today);

    // $("#almacen-select").on("change", function() {
    //     const almacen = $(this).val();
    //     const fecha = $("#fecha-input").val();
    //     fetchInventoryData(almacen, fecha);
    // });

    // $("#fecha-input").on("change", function() {
    //     const almacen = $("#almacen-select").val();
    //     const fecha = $(this).val();
    //     fetchInventoryData(almacen, fecha);
    // });

    // fetchInventoryData("", today);
});
