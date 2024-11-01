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
                        <td>${registro.VHP_PLACA}</td>
                        <td>${registro.conductor_nombre}</td>
                        <td>${registro.peso_bruto || '-'}</td>
                        <td>${registro.VHP_FECHA}</td>
                        <td>${registro.VHP_HORA}</td>
                        <td>${registro.codigo_productos} || 'Vacio'</td>
                        <td>${registro.producto_ingresado} || 'Vacio'</td>
                        <td>${registro.peso_tara || '-'}</td>
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
                        <td colspan="13" class="text-center text-gray-500">No hay registros</td>
                    </tr>
                `);
            }

            if (table) {
                table.destroy();  
            }

            table = new simpleDatatables.DataTable("#default-table", {
                perPage: 10,
                perPageSelect: [10, 20, 30, 40, 50],
                data: {
                    headings: ["Número", "Placa", "Conductor", "Peso Entrada", "Peso Salida", "Peso Neto", "Fecha", "Hora Entrada", "Código Producto", "Producto Ingresado", "Hora Salida", "Estado", "Caso"],
                    data: response.map(function(registro) {
                        let estatusClass = '';
                        if (registro.estatus === 'Pendiente') {
                            estatusClass = 'row-pendiente';
                        } else if (registro.estatus === 'Finalizado') {
                            estatusClass = 'row-finalizado';
                        }

                        let casoText = '';
                        if (registro.caso == '0') {
                            casoText = 'Producto';
                        } else if (registro.caso == '1') {
                            casoText = 'Múltiple';
                        } else if (registro.caso == '2') {
                            casoText = 'Vacío';
                        } else {
                            casoText = '-';
                        }

                        return [
                            `<span>${registro.id}</span>`,
                            `<span class="font-bold">${registro.VHP_PLACA}</span>`,
                            `<span class="font-bold">${registro.conductor_nombre}</span>`,
                            `<span class="font-bold">${registro.peso_bruto || '-'}</span>`,
                            `<span class="font-bold">${registro.peso_tara || '-'}</span>`,
                            `<span class="font-bold">${registro.peso_neto || '-'}</span>`,
                            `<span class="font-bold">${registro.VHP_FECHA}</span>`,
                            `<span class="font-bold">${registro.VHP_HORA}</span>`,
                            `<span class="font-bold">${registro.codigo_productos || 'Vacío'}</span>`,
                            `<span class="font-bold">${registro.producto_ingresado || 'Vacío'}</span>`,
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
                var caso = $(cells[13]).text().trim(); 
            
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
        $.ajax({
            url: wb_subdir + '/php/vehiculos/checkStatusCase1.php', 
            method: 'POST',
            data: { vehiculoId: id },
            success: function(response) {
                if (response.estatus === 'Finalizado') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Este vehículo ya ha finalizado su proceso de descarga.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#053684'
                    });
                    return; 
                } else {
                    iniciarModalCaso0(id);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al verificar el estatus del vehículo:', error);
            }
        });
    }

    function iniciarModalCaso0(id) {
        let pesoBrutoInicial = null; 
        let pesoActual = null;
    
        Swal.fire({
            title: 'Salida de Vehículo - Producto Único',
            html: `
                <div class="relative bg-white shadow-lg rounded-lg p-6" style="width: 100%; max-width: 500px; margin: 0 auto;">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <form id="formSalidaCaso0" class="space-y-4">
                        <div class="space-y-4" id="productos-container">
                            <div id="producto-section-1">
                                <label for="producto" class="block text-sm font-medium text-gray-700 mb-1">Producto a descargar</label>
                                <select id="producto" name="producto" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione un producto</option>
                                </select>
                                <div class="mt-2">
                                    <label for="pesoBruto" class="block text-sm font-medium text-gray-700 mb-1">Peso Bruto Actual</label>
                                    <div class="flex items-center space-x-2">
                                        <input type="number" id="pesoBrutoCaso0" name="pesoBruto" 
                                            class="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="Peso del vehículo" required>
                                        <button type="button" id="leerPesoVehiculoCaso0" 
                                            class="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                                            Leer Peso
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="notification" style="display:none;" class="mt-4 alert alert-success"></div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="mt-6">
                            <button type="button" id="registrarSalida" class="w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                Registrar Salida
                            </button>
                        </div>
                    </form>
                </div>
            `,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            confirmButtonColor: '#053684',
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
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/getTaraCase1.php',
                    method: 'POST',
                    data: { vehiculoId: id },
                    success: function(response) {
                        pesoBrutoInicial = parseFloat(response.pesoBruto);
                        pesoActual = pesoBrutoInicial;
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener el peso bruto inicial:', error);
                    }
                });
    
                $("#leerPesoVehiculoCaso0").on("click", function() {
                    let $button = $(this);
                    let originalButtonText = $button.html();
    
                    $button.html('<i data-lucide="loader" class="lucide animate-spin mr-2"></i> Leyendo...').prop('disabled', true);
    
                    $.ajax({
                        url: 'http://localhost:81/index',
                        method: 'POST',
                        success: function(response) {
                            const match = response.match(/[-+]?\d*\.?\d+/);
                            if (match) {
                                pesoActual = parseFloat(match[0]);
                                $('#pesoBrutoCaso0').val(pesoActual);
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
    
                $('#registrarSalida').on('click', function(e) {
                    e.preventDefault();
    
                    const productoSeleccionado = $('#producto').val();
                    const pesoBrutoActual = parseFloat($('#pesoBrutoCaso0').val());
    
                    if (!productoSeleccionado || isNaN(pesoBrutoActual) || pesoBrutoActual <= 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Debe seleccionar un producto y leer un peso válido.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
    
                    const pesoDescargado = pesoBrutoInicial - pesoBrutoActual;
                    if (pesoDescargado <= 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El peso actual debe ser menor que el peso bruto inicial para calcular correctamente el peso descargado.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
    
                    const pesoTara = pesoBrutoActual;
                    const pesoNeto = pesoDescargado; 
                    
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/saveVehicleExitCase0.php',
                        method: 'POST',
                        data: {
                            vehiculoId: id,
                            producto: productoSeleccionado,
                            pesoTara: pesoTara,
                            pesoNeto: pesoNeto
                        },
                        success: function(response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Proceso completado',
                                text: `El producto (${productoSeleccionado}) de ${pesoNeto} kg ha sido descargado y el proceso ha finalizado.`,
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                Swal.close();
                                cargarRegistros($('#fecha-table').val());
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
        $.ajax({
            url: wb_subdir + '/php/vehiculos/checkStatusCase1.php', 
            method: 'POST',
            data: { vehiculoId: id },
            success: function(response) {
                if (response.estatus === 'Finalizado') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Este vehículo ya ha finalizado su proceso de descarga.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#053684'
                    });
                    return; 
                } else {
                    iniciarModalCaso1(id);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al verificar el estatus del vehículo:', error);
            }
        });
    }
    
    function iniciarModalCaso1(id) {
        let pesoBrutoInicial = null; 
        let pesoActual = null;
        let pesoDescargadoTotal = 0; 
    
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
                        <div class="space-y-4" id="productos-container">
                            <div id="producto-section-1">
                                <label for="producto" class="block text-sm font-medium text-gray-700 mb-1">Producto a descargar</label>
                                <select id="producto" name="producto" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione un producto</option>
                                </select>
                                <div class="mt-2">
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
                            </div>
                        </div>
                        <div id="notification" style="display:none;" class="mt-4 alert alert-success"></div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="mt-6">
                            <button type="button" id="registrarSalida" class="w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                Registrar Salida Parcial
                            </button>
                        </div>
                    </form>
                </div>
            `,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            confirmButtonColor: '#053684',
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
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/getTaraCase1.php',
                    method: 'POST',
                    data: { vehiculoId: id },
                    success: function(response) {
                        pesoBrutoInicial = parseFloat(response.pesoBruto);
                        pesoActual = pesoBrutoInicial;
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener el peso bruto inicial:', error);
                    }
                });
    
                $("#leerPesoVehiculoCaso1").on("click", function() {
                    let $button = $(this);
                    let originalButtonText = $button.html();
    
                    $button.html('<i data-lucide="loader" class="lucide animate-spin mr-2"></i> Leyendo...').prop('disabled', true);
    
                    $.ajax({
                        url: 'http://localhost:81/index',
                        method: 'POST',
                        success: function(response) {
                            const match = response.match(/[-+]?\d*\.?\d+/);
                            if (match) {
                                pesoActual = parseFloat(match[0]);
                                $('#pesoBrutoCaso1').val(pesoActual);
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
    
                $('#registrarSalida').on('click', function(e) {
                    e.preventDefault();
    
                    const productoSeleccionado = $('#producto').val();
                    const pesoBrutoActual = parseFloat($('#pesoBrutoCaso1').val());
                    const pesoDescargado = pesoBrutoInicial - pesoBrutoActual;
    
                    if (!productoSeleccionado || isNaN(pesoDescargado) || pesoDescargado <= 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Debe seleccionar un producto y leer un peso válido.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
    
                    pesoDescargadoTotal += pesoDescargado;
                    pesoBrutoInicial = pesoBrutoActual;
                    pesoTara = pesoActual - pesoDescargadoTotal;
    
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/saveVehicleExitCase1.php',
                        method: 'POST',
                        data: {
                            vehiculoId: id,
                            producto: productoSeleccionado,
                            pesoTara: pesoTara, 
                            pesoNeto: pesoActual - pesoTara 
                        },
                        success: function(response) {
                            $('#producto option:selected').remove();
                            $('#pesoBrutoCaso1').val('');
    
                            if ($('#producto option').length > 1) {
                                $("#notification").html(`<div class="alert alert-success">Producto ${productoSeleccionado} registrado correctamente.</div>`)
                                    .fadeIn().delay(1500).fadeOut();
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Proceso completado',
                                    text: 'Todos los productos han sido descargados. El proceso ha finalizado.',
                                    confirmButtonColor: '#053684',
                                    confirmButtonText: 'OK'
                                }).then(() => {
                                    Swal.close();
                                    cargarRegistros($('#fecha-table').val());
                                });
                            }
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

    function abrirModalCaso2(id) {
        $.ajax({
            url: wb_subdir + '/php/vehiculos/checkStatusCase1.php', 
            method: 'POST',
            data: { vehiculoId: id },
            success: function(response) {
                if (response.estatus === 'Finalizado') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Este vehículo ya ha finalizado su proceso de descarga.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#053684'
                    });
                    return; 
                } else {
                    iniciarModalCaso2(id);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al verificar el estatus del vehículo:', error);
            }
        });
    }
    
    function iniciarModalCaso2(id) {
        Swal.fire({
            title: 'Salida de Vehículo - Sin Productos',
            html: `
                <div class="relative bg-white shadow-lg rounded-lg p-6" style="width: 100%; max-width: 500px; margin: 0 auto;">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <form id="formSalidaCaso2" class="space-y-4">
                        <div>
                            <label for="pesoBruto" class="block text-sm font-medium text-gray-700 mb-1">Peso Bruto</label>
                            <div class="flex items-center space-x-2">
                                <input type="number" id="pesoBrutoCaso2" name="pesoBruto" 
                                       class="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                       placeholder="Peso del vehículo" required>
                                <button type="button" id="leerPesoVehiculoCaso2" 
                                        class="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                                    Leer Peso
                                </button>
                            </div>
                        </div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="mt-6">
                            <button type="submit" class="w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                Registrar Salida
                            </button>
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
    
                $("#leerPesoVehiculoCaso2").on("click", function() {
                    let $button = $(this);
                    let originalButtonText = $button.html();
    
                    $button.html('<i data-lucide="loader" class="lucide animate-spin mr-2"></i> Leyendo...').prop('disabled', true);
    
                    $.ajax({
                        url: 'http://localhost:81/index',
                        method: 'POST',
                        success: function(response) {
                            const match = response.match(/[-+]?\d*\.?\d+/);
                            if (match) {
                                $('#pesoBrutoCaso2').val(parseFloat(match[0]));
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
    
                $('#formSalidaCaso2').on('submit', function(e) {
                    e.preventDefault();
                    let formData = new FormData(this);
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/saveVehicleExitCase2.php', 
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
                            });
                            cargarRegistros($('#fecha-table').val()); 
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
    
    $('#fecha-table').on('change', function() {
        let fechaSeleccionada = $(this).val();
        cargarRegistros(fechaSeleccionada);
    });

    let fechaInicial = $('#fecha-table').val();
    cargarRegistros(fechaInicial);

    //CHECKBOXES BEHAVIOR
    const $productSelect = $("#productSelect"); 
    const $multipleProductSelect = $("#multipleProductSelect"); 
    const $productLabel = $("#productLabel");
    const $multipleProductLabel = $("#multipleProductLabel");
    const $productRegister = $("#registerForm");
    const $productWeight = $("#entryWeight");
    const $productRead = $("#readWeight");
    const $productEntryCheckbox = $("#product-entry"); 
    const $multipleProductsCheckbox = $("#multiple-products"); 
    const $noProductEntryCheckbox = $("#no-product-entry"); 

    function initializeSelect2() {
        $productSelect.select2({
            placeholder: "Buscar producto...",
            width: '100%',
            allowClear: true
        });
    }

    function initializeMultipleSelect2() {
        $multipleProductSelect.select2({
            placeholder: "Selecciona varios productos...",
            width: '100%',
            allowClear: true
        });
    }

    function destroySelect2() {
        if ($productSelect.hasClass("select2-hidden-accessible")) {
            $productSelect.select2('destroy').hide(); 
        }
    }

    function destroyMultipleSelect2() {
        if ($multipleProductSelect.hasClass("select2-hidden-accessible")) {
            $multipleProductSelect.select2('destroy').hide(); 
        }
    }

    destroySelect2();
    destroyMultipleSelect2();
    $productRegister.addClass('hidden');
    $productLabel.addClass('hidden');
    $multipleProductLabel.addClass('hidden');
    $productWeight.addClass('hidden');
    $productRead.addClass('hidden');
    $multipleProductSelect.addClass('hidden');

    // Caso 1
    $productEntryCheckbox.change(function () {
        if ($(this).is(':checked')) {
            $productSelect.show();
            initializeSelect2();
            $productRegister.removeClass('hidden');
            $productLabel.removeClass('hidden');
            $productWeight.removeClass('hidden');
            $productRead.removeClass('hidden');

            $multipleProductsCheckbox.prop('disabled', true);
            $noProductEntryCheckbox.prop('disabled', true);

            $productSelect.empty();
            $productSelect.append($("<option>", {
                value: '',
                text: ''
            }));

            $.ajax({
                url: wb_subdir + '/php/inventario/productsCode.php',
                method: 'POST',
                dataType: 'JSON',
                success: function(data) {
                    const productos = data.data;

                    $.each(productos, function(index, producto) {
                        $productSelect.append($("<option>", {
                            value: producto.codigo,
                            text: producto.nombre
                        }));
                    });

                    $productSelect.trigger('change');
                },
                error: function(xhr, status, error) {
                    console.error('Error al cargar los datos:', error);
                }
            });
        } else {
            destroySelect2();
            $productRegister.addClass('hidden');
            $productLabel.addClass('hidden');
            $productWeight.addClass('hidden');
            $productRead.addClass('hidden');

            $multipleProductsCheckbox.prop('disabled', false);
            $noProductEntryCheckbox.prop('disabled', false);
        }
    });

    // Caso 2
    $multipleProductsCheckbox.change(function () {
        if ($(this).is(':checked')) {
            $multipleProductSelect.removeClass('hidden');
            $multipleProductLabel.removeClass('hidden'); 
            initializeMultipleSelect2();
            $productRegister.removeClass('hidden');
            $productWeight.removeClass('hidden');
            $productRead.removeClass('hidden');

            $productEntryCheckbox.prop('disabled', true);
            $noProductEntryCheckbox.prop('disabled', true);

            $multipleProductSelect.empty();

            $.ajax({
                url: wb_subdir + '/php/inventario/productsCode.php',
                method: 'POST',
                dataType: 'JSON',
                success: function(data) {
                    const productos = data.data;

                    $.each(productos, function(index, producto) {
                        $multipleProductSelect.append($("<option>", {
                            value: producto.codigo,
                            text: producto.nombre
                        }));
                    });

                    $multipleProductSelect.trigger('change');
                },
                error: function(xhr, status, error) {
                    console.error('Error al cargar los datos:', error);
                }
            });
        } else {
            destroyMultipleSelect2();
            $productRegister.addClass('hidden');
            $multipleProductLabel.addClass('hidden'); 
            $productWeight.addClass('hidden');
            $productRead.addClass('hidden');

            $productEntryCheckbox.prop('disabled', false);
            $noProductEntryCheckbox.prop('disabled', false);
        }
    });

    // Caso 3
    $noProductEntryCheckbox.change(function () {
        if ($(this).is(':checked')) {
            $productRegister.removeClass('hidden');
            $productWeight.removeClass('hidden');
            $productRead.removeClass('hidden');
            $productSelect.empty();
            $productSelect.append($("<option>", {
                value: 'Vacio',
                text: 'Vacío'
            }));

            $productEntryCheckbox.prop('disabled', true);
            $multipleProductsCheckbox.prop('disabled', true);

            destroySelect2();
            destroyMultipleSelect2();
            $productLabel.addClass('hidden');
            $multipleProductLabel.addClass('hidden');
            $multipleProductSelect.addClass('hidden');
        } else {
            $productRegister.addClass('hidden');
            $productWeight.addClass('hidden');
            $productRead.addClass('hidden');
            $productEntryCheckbox.prop('disabled', false);
            $multipleProductsCheckbox.prop('disabled', false);
        }
    });

    $('#entryForm').on('submit', function(e) {
        e.preventDefault();

        let caso = $('#product-entry').is(':checked') ? 0 : ($('#multiple-products').is(':checked') ? 1 : 2);
    
        if (!$('#plate').val() || !$('#driverName').val() || !$('#driver').val() || !$('#plateType').val() ||
            !$('#entryWeight').val() || !$('#fecha-form').val() || 
            (!$('#product-entry').is(':checked') && !$('#multiple-products').is(':checked') && caso !== 2)) {
            
            Swal.fire({
                icon: 'warning',
                title: 'Por favor completa todos los campos obligatorios',
                confirmButtonColor: '#053684',
                showConfirmButton: true
            });
            return;
        }
    
        let data = {
            placa: $('#plate').val(),
            conductor: $('#driverName').val(),
            cedula: $('#driver').val(),
            tipo: $('#plateType').val(),
            peso_bruto: $('#entryWeight').val(),
            fecha_peso_bruto: $('#fecha-form').val(),
            hora_entrada: $('#hiddenTimeInput').val(),
            vehiculo_activo: 'Sí',
            caso: caso 
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
                console.log(data);
                Swal.fire({
                    icon: 'success',
                    title: 'Registro agregado',
                    confirmButtonColor: '#053684',
                    showConfirmButton: true
                });
    
                $('#entryForm')[0].reset();
    
                const today = new Date().toISOString().split('T')[0];
                $('#fecha-form').val(today);
    
                $('#product-entry, #multiple-products, #no-product-entry').prop('checked', false);
                destroySelect2();
                destroyMultipleSelect2();
            
                $productEntryCheckbox.prop('disabled', false);
                $multipleProductsCheckbox.prop('disabled', false);
                $noProductEntryCheckbox.prop('disabled', false);
                $productLabel.addClass('hidden');
                $multipleProductLabel.addClass('hidden');
                $productRegister.addClass('hidden');
                $productWeight.addClass('hidden');
                $productRead.addClass('hidden');
                $multipleProductSelect.addClass('hidden');
                cargarRegistros($('#fecha-table').val());
            },
            error: function(xhr, status, error) {
                console.error('Error al registrar el vehículo:', error);
                Swal.fire('Error al registrar el vehículo', '', 'error');
            }
        });
    });  
});
