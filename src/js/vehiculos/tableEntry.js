jQuery(document).ready(function($) {

    let table;

    function cargarRegistros(fecha) {
        $.ajax({
            url: wb_subdir + '/php/vehiculos/loadVehicleDataTable.php',
            method: 'POST',
            data: { fecha: fecha },
            dataType: 'JSON',
            success: function(response) {
                console.log(response);
                let tbody = $('#default-table tbody');
                tbody.empty();

                if (response.length > 0) {
                    response.forEach(function(registro) {
                        let row = `
                        <tr data-id="${registro.id}" data-caso="${registro.caso}">
                            <td>${registro.id}</td>
                            <td>${registro.placa}</td>
                            <td>${registro.conductor}</td>
                            <td>${registro.tipo}</td>
                            <td>${registro.peso_tara}</td>
                            <td>${registro.fecha_peso_tara}</td>
                            <td>${registro.hora_entrada}</td>
                            <td>${registro.codigo_productos}</td>
                            <td>${registro.producto_ingresado}</td>
                            <td>${registro.vehiculo_activo}</td>
                            <td>${registro.peso_bruto || '-'}</td>
                            <td>${registro.peso_neto || '-'}</td>
                            <td>${registro.hora_salida || '-'}</td>
                            <td>${registro.estatus}</td>
                            <td>${registro.caso}</td>
                        </tr>
                    `;

                        tbody.append(row);
                    });
                } else {
                    tbody.append(`
                        <tr>
                            <td colspan="12" class="text-center text-gray-500">No hay registros</td>
                        </tr>
                    `);
                }

                if (table) {
                    table.destroy();  
                }

                table = new simpleDatatables.DataTable("#default-table", {
                    perPage: 5,
                    perPageSelect: [5, 10, 20],
                    data: {
                        headings: ["Numero", "Placa", "Conductor","Tipo", "Peso - Tara", "Fecha de Peso Tara", "Hora Entrada", "Código Producto", "Producto Ingresado", "Vehículo Activo", "Peso Bruto", "Peso Neto", "Hora Salida", "Estado", "Caso"],
                        data: response.map(function(registro) {
                            let estatusClass = '';
                            if (registro.estatus === 'Pendiente') {
                                estatusClass = 'row-pendiente';
                            } else if (registro.estatus === 'Finalizado') {
                                estatusClass = 'row-finalizado';
                            }
                
                            let casoText = '';
                            if (registro.caso === 0) {
                                casoText = 'Producto';
                            } else if (registro.caso === 1) {
                                casoText = 'Multiple';
                            } else if (registro.caso === 2) {
                                casoText = 'Vacío';
                            } else {
                                casoText = '-';
                            }
                
                            return [
                                `<span>${registro.id}</span>`,
                                `<span class="font-bold">${registro.placa}</span>`,
                                `<span class="font-bold">${registro.conductor}</span>`,
                                `<span class="font-bold">${registro.tipo}</span>`,
                                `<span class="font-bold">${registro.peso_tara}</span>`,
                                `<span class="font-bold">${registro.fecha_peso_tara}</span>`,
                                `<span class="font-bold">${registro.hora_entrada}</span>`,
                                `<span class="font-bold">${registro.codigo_productos}</span>`,
                                `<span class="font-bold">${registro.producto_ingresado}</span>`,
                                `<span class="font-bold">${registro.vehiculo_activo}</span>`,
                                `<span class="font-bold">${registro.peso_bruto || '-'}</span>`,
                                `<span class="font-bold">${registro.peso_neto || '-'}</span>`,
                                `<span class="font-bold">${registro.hora_salida || '-'}</span>`,
                                `<span class="${estatusClass}">${registro.estatus}</span>`,
                                `<span class="font-bold">${casoText}</span>`
                            ];
                        })
                    }
                });

                $('#default-table tbody').on('click', 'tr', function() {
                    var cells = $(this).find('td');
                    var id = $(cells[0]).text().trim(); 
                    var caso = $(cells[14]).text().trim(); 
                
                    console.log('ID:', id, 'Caso:', caso);
                    abrirModal(id, caso);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar los registros:', error);
            }
        });
    }

    function abrirModal(id, caso) {
        console.log('Abriendo modal para el caso:', caso); 
        if (caso === 'Producto') {
            abrirModalCaso0(id);
        } else if (caso === 'Multiple') {
            abrirModalCaso1(id);
        } else if (caso === 'Vacío') {
            abrirModalCaso2(id);
        }
    }

    function abrirModalCaso0(id) {
        Swal.fire({
            title: 'Salida de Vehículo - Un Solo Producto',
            html:
                `<div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <form id="formSalidaCaso0" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label for="pesoBruto" class="block text-sm font-medium text-gray-700">Peso Bruto</label>
                                <input type="number" id="pesoBrutoVehiculoCaso0" name="pesoBruto" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese el peso bruto" required>
                            </div>
                        </div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="text-center mt-4">
                            <button type="button" id="leerPesoVehiculoCaso0" class="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-900">Leer Peso</button>
                            <button type="submit" class="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-700">Registrar Salida</button>
                        </div>
                    </form>
                </div>`,
            width: 600,
            showConfirmButton: false,
            allowOutsideClick: false,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            },
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });
    
                $("#leerPesoVehiculoCaso0").on("click", function() {
                    obtenerPesoVehiculo('pesoBrutoVehiculoCaso0'); 
                });
    
                $("#formSalidaCaso0").on("submit", function(e) {
                    e.preventDefault();
                    let formData = new FormData(this);
                    $.ajax({
                        url: 'ruta_para_registrar_salida.php', 
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Salida registrada',
                                text: 'El vehículo ha salido exitosamente.',
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                Swal.close();  
                            });
                        },
                        error: function() {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Ocurrió un error al registrar la salida.',
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                });
            }
        });
    }
    
    function abrirModalCaso1(id) {
        Swal.fire({
            title: 'Salida de Vehículo - Múltiples Productos',
            html: `
                <div class="relative bg-white shadow-lg rounded-lg p-6" style="width: 100%; max-width: 500px; margin: 0 auto;">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <form id="formSalidaCaso1" class="space-y-4">
                        <div class="space-y-4">
                            <div>
                                <label for="producto" class="block text-sm font-medium text-gray-700 mb-1">Producto a descargar</label>
                                <select id="producto" name="producto" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione un producto</option>
                                </select>
                            </div>
                            <div>
                                <label for="pesoBruto" class="block text-sm font-medium text-gray-700 mb-1">Peso Bruto Actual</label>
                                <div class="flex items-center space-x-2">
                                    <input type="number" id="pesoBrutoCaso1" name="pesoBruto" 
                                        class="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Peso del vehículo" required>
                                    <button type="button" id="leerPesoVehiculoCaso1" 
                                        class="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                                        Leer Peso
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label for="pesoDescargado" class="block text-sm font-medium text-gray-700 mb-1">Peso Descargado</label>
                                <input type="number" id="pesoDescargado" name="pesoDescargado" 
                                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Ingrese el peso del producto descargado" required>
                            </div>
                        </div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="mt-6">
                            <button type="submit" class="w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                Registrar Salida Parcial
                            </button>
                        </div>
                    </form>
                </div>
            `,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            },
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });

                $.ajax({
                    url: wb_subdir + '/php/vehiculos/getProductsCase1.php',
                    method: 'POST',
                    data: { vehiculoId: id }, 
                    success: function(response) {
                        if (Array.isArray(response)) {
                            response.forEach(producto => {
                                if (producto.nombre) {
                                    $('#producto').append(new Option(producto.nombre, producto.nombre));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener productos:', error);
                    }
                });
    
                $("#leerPesoVehiculoCaso1").on("click", function() {
                    let $button = $(this);
                    let originalButtonText = $button.html();
                    
                    $button.html('<i data-lucide="loader" class="lucide animate-spin mr-2"></i> Leyendo...')
                           .prop('disabled', true);
    
                    $.ajax({
                        url: 'http://localhost:81/index',
                        method: 'POST',
                        success: function(response) {
                            const match = response.match(/[-+]?\d*\.?\d+/);
                            if (match) {
                                const peso = match[0];
                                $('#pesoBrutoCaso1').val(peso); 
                            }
                        },
                        error: function(xhr, status, error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un problema al obtener el peso.',
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            });
                        },
                        complete: function() {
                            $button.html(originalButtonText).prop('disabled', false); 
                            lucide.createIcons(); 
                        }
                    });
                });
    
                $('#formSalidaCaso1').on('submit', function(e) {
                    e.preventDefault();
                    let formData = new FormData(this);
                    $.ajax({
                        url: 'ruta_para_registrar_salida_multiple.php',
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Salida parcial registrada',
                                text: 'Producto descargado exitosamente.',
                                confirmButtonText: 'OK'
                            });
                            cargarRegistros($('#fecha-table').val());
                        },
                        error: function() {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Ocurrió un error al registrar la salida.',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                });
            }
        });
    }
    
    
    function abrirModalCaso2(id) {
        Swal.fire({
            title: 'Salida de Vehículo - Sin Productos',
            html: `
                <div>
                    <form id="formSalidaCaso2">
                        <div>
                            <label for="pesoBruto">Peso Bruto</label>
                            <input type="number" id="pesoBrutoCaso2" name="pesoBruto" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese el peso bruto" required>
                        </div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="text-center mt-4">
                            <button type="submit" class="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-700">Registrar Salida</button>
                        </div>
                    </form>
                </div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                $('#formSalidaCaso2').on('submit', function(e) {
                    e.preventDefault();
                    let formData = new FormData(this);
                    $.ajax({
                        url: 'ruta_para_registrar_salida_sin_producto.php', 
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Salida registrada',
                                text: 'El vehículo ha salido exitosamente.',
                                confirmButtonText: 'OK'
                            });
                            cargarRegistros($('#fecha-table').val()); 
                        },
                        error: function() {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Ocurrió un error al registrar la salida.',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                });
            }
        });
    }

    $('#fecha-table').on('change', function() {
        let fechaSeleccionada = $(this).val();
        cargarRegistros(fechaSeleccionada);
    });

    let fechaInicial = $('#fecha-table').val();
    cargarRegistros(fechaInicial);

    $('#entryForm').on('submit', function(e) {
        e.preventDefault();

        let data = {
            placa: $('#plate').val(),
            conductor: $('#driverName').val(),
            cedula: $('#driver').val(),
            tipo: $('#plateType').val(),
            peso_tara: $('#entryWeight').val(),
            fecha_peso_tara: $('#fecha-form').val(),
            hora_entrada: $('#hiddenTimeInput').val(),
            vehiculo_activo: 'Sí',
            caso: $('#product-entry').is(':checked') ? 0 : ($('#multiple-products').is(':checked') ? 1 : 2)  
        };

        if (data.caso === 0) {
            data.codigo_productos = $('#productSelect').val();
            data.producto_ingresado = $('#productSelect option:selected').text();
        } else if (data.caso === 1) {
            data.codigo_productos = $('#multipleProductSelect').val().join(',');
            data.producto_ingresado = $('#multipleProductSelect option:selected').map(function() {
                return $(this).text();
            }).get().join(',');
        } else {
            data.codigo_productos = 'Vacío';
            data.producto_ingresado = 'Vacío';
        }

        $.ajax({
            url: wb_subdir + '/php/vehiculos/registerVehicleTable.php',
            method: 'POST',
            data: data,
            success: function() {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro agregado',
                    confirmButtonColor: '#053684',
                    showConfirmButton: true
                });
                cargarRegistros($('#fecha-table').val());
            },
            error: function(xhr, status, error) {
                console.error('Error al registrar el vehículo:', error);
                Swal.fire('Error al registrar el vehículo', '', 'error');
            }
        });
    });
});
