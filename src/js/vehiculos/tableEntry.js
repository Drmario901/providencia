jQuery(document).ready(function($) {

    let table;

    $('#fecha-table').on('change', function() {
        let fechaSeleccionada = $(this).val();
        let fechaInicio = $('#startDate').val();
        let fechaFin = $('#endDate').val();

        if (!fechaInicio || !fechaFin) {
            cargarRegistros(fechaSeleccionada);
        }
    });

    function cargarRegistros(fecha, fechaInicio, fechaFin) {
        let data = {};
    
        if (fechaInicio && fechaFin) {
            data = { startDate: fechaInicio, endDate: fechaFin };
        } else if (fecha) {
            data = { fecha: fecha };
        }
    
        let tbody = $('#default-table tbody');
        tbody.empty().append(`
            <tr>
                <td colspan="13" class="text-center">
                    <div class="spinner-container">
                        <div class="spinner"></div>
                    </div>
                </td>
            </tr>
        `);
    
        $('<style>')
            .prop('type', 'text/css')
            .html(`
                .spinner-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #1e3a8a;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `)
            .appendTo('head');
    
        $.ajax({
            url: wb_subdir + '/php/vehiculos/loadVehicleDataTable.php',
            method: 'POST',
            data: data,
            dataType: 'JSON',
            success: function(response) {
                if (table) {
                    table.destroy();
                }
    
                table = new simpleDatatables.DataTable("#default-table", {
                    perPage: 30,
                    perPageSelect: [5,10,20,30,40,50,60],
                    data: {
                        headings: ["Número", "Placa", "Conductor", "Peso Entrada", "Peso Salida", "Peso Neto", "Fecha Entrada", "Fecha Salida", "Hora Entrada", "Hora Salida"/*, "Código Producto",*/ ,"Producto Ingresado", "Estado", "Caso"],
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
                                `<span class="font-bold">${registro.peso_salida || '-'}</span>`,
                                `<span class="font-bold">${registro.peso_neto || '-'}</span>`,
                                `<span class="font-bold">${registro.fecha_entrada || '-'}</span>`,
                                `<span class="font-bold">${registro.fecha_salida || '-'}</span>`,
                                `<span class="font-bold">${registro.hora_entrada}</span>`,
                                `<span class="font-bold">${registro.hora_salida || 'Vacío'}</span>`,
                               // `<span class="font-bold">${registro.codigo_productos || 'Vacío'}</span>`,
                                `<span class="font-bold">${registro.producto_ingresado || 'Vacío'}</span>`,
                                `<span class="${estatusClass}">${registro.estatus}</span>`,
                                `<span class="font-bold">${casoText}</span>`
                            ];
                        })
                    }
                });
    
                $(document).on('click', '#default-table tbody tr', function() {
                    let cells = $(this).find('td');
                    let id = $(cells[0]).text().trim();
                
                    if (id) {
                        $.ajax({
                            url: wb_subdir + '/php/vehiculos/checkStatusCase1.php',
                            method: 'POST',
                            data: { vehiculoId: id },
                            success: function(response) {
                                if (response && response.case) {
                                    console.log('ID:', id, 'Caso:', response.case);
                                    abrirModal(id, response.case); 
                                } else {
                                    console.error('No se recibió un caso válido en la respuesta.');
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('Error al verificar el caso:', error);
                            }
                        });
                    } else {
                        console.error('El ID no fue encontrado en la fila seleccionada.');
                    }

                    function abrirModal(id, caso) {
                        console.log('Abriendo modal para el caso:', caso);
                        if (caso === 'Producto') {
                            manejarCaso(id, 'Producto');
                        } else if (caso === 'Múltiple') {
                            manejarCaso(id, 'Múltiple');
                        } else if (caso === 'Vacío') {
                            manejarCaso(id, 'Vacío');
                        }
                    }
                
                    function manejarCaso(id, tipoCaso) {
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
                                    if (tipoCaso === 'Producto') {
                                        iniciarModalCaso0(id);
                                    } else if (tipoCaso === 'Múltiple') {
                                        iniciarModalCaso1(id);
                                    } else if (tipoCaso === 'Vacío') {
                                        iniciarModalCaso2(id);
                                    }
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('Error al verificar el estatus del vehículo:', error);
                            }
                        });
                    }
                });                                                
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar los registros:', error);
                tbody.empty().append(`
                    <tr>
                        <td colspan="13" class="text-center text-red-500">Error al cargar los registros</td>
                    </tr>
                `);
            }
        });
    }
    
    // function abrirModal(id, caso) {
    //     console.log('Abriendo modal para el caso:', caso); 
    //     if (caso === 'Producto') {
    //         abrirModalCaso0(id);
    //     } else if (caso === 'Múltiple') {
    //         abrirModalCaso1(id);
    //     } else if (caso === 'Vacío') {
    //         abrirModalCaso2(id);
    //     }
    // }

    // function abrirModalCaso0(id) {
    //     $.ajax({
    //         url: wb_subdir + '/php/vehiculos/checkStatusCase1.php', 
    //         method: 'POST',
    //         data: { vehiculoId: id },
    //         success: function(response) {
    //             if (response.estatus === 'Finalizado') {
    //                 Swal.fire({
    //                     icon: 'info',
    //                     title: 'Este vehículo ya ha finalizado su proceso de descarga.',
    //                     confirmButtonText: 'OK',
    //                     allowOutsideClick: false,
    //                     allowEscapeKey: false,
    //                     confirmButtonColor: '#053684'
    //                 });
    //                 return; 
    //             } else {
    //                 iniciarModalCaso0(id);
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error('Error al verificar el estatus del vehículo:', error);
    //         }
    //     });
    // }

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
    
                                <label for="unidadMedida" class="block text-sm font-medium text-gray-700 mb-1 mt-2">Unidad de Medida</label>
                                <select id="unidadMedida" name="unidadMedida" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione una unidad de medida</option>
                                </select>
    
                                <label for="silo" class="block text-sm font-medium text-gray-700 mb-1 mt-2">Silo</label>
                                <select id="silo" name="silo" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione un silo</option>
                                </select>
    
                                <div class="mt-2">
                                    <label for="cantidad" class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                    <input type="number" id="cantidad" name="cantidad" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ingrese la cantidad" required>
                                </div>
    
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
                                    <div class="mt-2">
                                    <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                    <input type="text" id="observaciones" name="observaciones" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Ingrese su observacion">
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
            allowEscapeKey: false,
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
                        $('#producto').empty();
                        if (response.error) {
                            $('#producto').append(new Option('Error al cargar productos', ''));
                            return;
                        } else if (response.mensaje) {
                            $('#producto').append(new Option('No se encontraron productos', ''));
                            return;
                        }
    
                        if (Array.isArray(response)) {
                            response.forEach(producto => {
                                if (producto.codigo && producto.descripcion) {
                                    $('#producto').append(new Option(producto.descripcion, producto.codigo));
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
                    url: wb_subdir + '/php/vehiculos/getUnd.php',
                    method: 'POST',
                    success: function(response) {
                        $('#unidadMedida').empty();
                        if (response.data && Array.isArray(response.data)) {
                            response.data.forEach(unidad => {
                                if (unidad.unidad) {
                                    $('#unidadMedida').append(new Option(unidad.unidad, unidad.unidad));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener unidades de medida:', error);
                    }
                });
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/getSilos.php',
                    method: 'POST',
                    success: function(response) {
                        $('#silo').empty();
                        if (response.data && Array.isArray(response.data)) {
                            response.data.forEach(silo => {
                                if (silo.silo) {
                                    $('#silo').append(new Option(silo.silo, silo.silo));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener silos:', error);
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
                            const match = response.match(/[-+]?\\d*\\.?\\d+/);
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
    
                $('#registrarSalida').off('click').on('click', function(e) {
                    e.preventDefault();
                    const $button = $(this);
                    $button.prop('disabled', true).text('Procesando...');
                
                    const productoSeleccionado = $('#producto').val();
                    const unidadMedidaSeleccionada = $('#unidadMedida').val();
                    const siloSeleccionado = $('#silo').val();
                    const cantidadIngresada = $('#cantidad').val();
                    const pesoBrutoActual = parseFloat($('#pesoBrutoCaso0').val());
                    const observaciones = $('#observaciones').val();
                    console.log(siloSeleccionado)
                
                    if (!productoSeleccionado || !unidadMedidaSeleccionada || !siloSeleccionado || !cantidadIngresada || isNaN(pesoBrutoActual) || pesoBrutoActual <= 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Debe completar todos los campos y leer un peso válido.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                        $button.prop('disabled', false).text('Registrar Salida'); 
                        return;
                    }
                
                    const pesoNeto = pesoActual - pesoBrutoActual;
                
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/saveVehicleExitCase0.php',
                        method: 'POST',
                        data: {
                            vehiculoId: id,
                            producto: productoSeleccionado,
                            unidadMedida: unidadMedidaSeleccionada,
                            silo: siloSeleccionado,
                            cantidad: cantidadIngresada,
                            observaciones: observaciones,
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
                                if ($('#print').is(':checked')) {
                                    $.ajax({
                                        url: wb_subdir + '/php/vehiculos/exitTicketData.php',
                                        method: 'POST',
                                        data: { vehiculoId: id },
                                        dataType: 'json',
                                        success: function(response) {
                                            if (response.status === 'success') {
                                                const data = response.data;
                
                                                $.ajax({
                                                    url: 'http://127.0.0.1:81/exit',
                                                    method: 'POST',
                                                    contentType: 'application/json',
                                                    data: JSON.stringify({
                                                        placa: data.VHP_PLACA,
                                                        chofer: data.conductor_nombre,
                                                        cedula: data.cedula,
                                                        destino: data.destino,
                                                        silo_origen: data.silo_origen,
                                                        peso_bruto: data.peso_bruto,
                                                        peso_neto: data.peso_neto,
                                                        codigo_productos: data.codigo_productos,
                                                        producto_ingresado: data.productos,
                                                        productos_con_silos: data.productos_con_silos
                                                    }),
                                                    success: function(printResponse) {
                                                        console.log("Respuesta de impresión:", printResponse);
                                                        $('#notification').html('<div class="alert alert-success">Salida registrada e impresión realizada correctamente.</div>').fadeIn();
                                                    },
                                                    error: function(xhr, status, error) {
                                                        console.error('Error al enviar los datos de impresión:', error);
                                                        $('#notification').html('<div class="alert alert-danger">Error al realizar la impresión.</div>').fadeIn();
                                                    }
                                                });
                                            } else {
                                                console.error('Error al obtener datos del ticket:', response);
                                            }
                                        },
                                        error: function(xhr, status, error) {
                                            console.error('Error al obtener datos para impresión:', error);
                                        }
                                    });
                                }
                
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
                        },
                        complete: function() {
                            $button.prop('disabled', false).text('Registrar Salida'); 
                        }
                    });
                });                               
            }
        });
    }
    
    // function abrirModalCaso1(id) {
    //     $.ajax({
    //         url: wb_subdir + '/php/vehiculos/checkStatusCase1.php', 
    //         method: 'POST',
    //         data: { vehiculoId: id },
    //         success: function(response) {
    //             if (response.estatus === 'Finalizado') {
    //                 console.log(response.estatus)
    //                 Swal.fire({
    //                     icon: 'info',
    //                     title: 'Este vehículo ya ha finalizado su proceso de descarga.',
    //                     confirmButtonText: 'OK',
    //                     confirmButtonColor: '#053684'
    //                 });
    //                 return; 
    //             } else {
    //                 iniciarModalCaso1(id);
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error('Error al verificar el estatus del vehículo:', error);
    //         }
    //     });
    // }
    
    function iniciarModalCaso1(id) {
        let pesoBrutoInicial = null;
        let pesoActual = null;
        let pesoDescargadoTotal = 0;
        const storageKey = `vehiculo_${id}_descarga`;
    
        const storedData = sessionStorage.getItem(storageKey);
        if (storedData) {
            const { pesoDescargadoTotal: storedPesoDescargadoTotal, pesoBrutoInicial: storedPesoBrutoInicial } = JSON.parse(storedData);
            pesoDescargadoTotal = storedPesoDescargadoTotal;
            pesoBrutoInicial = storedPesoBrutoInicial;
        }
    
        Swal.fire({
            title: 'Salida de Vehículo - Múltiples Productos',
            html: 
                `<div class="relative bg-white shadow-lg rounded-lg p-6" style="width: 100%; max-width: 500px; margin: 0 auto;">
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
    
                                <label for="unidadMedida" class="block text-sm font-medium text-gray-700 mb-1 mt-2">Unidad de Medida</label>
                                <select id="unidadMedida" name="unidadMedida" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione una unidad de medida</option>
                                </select>
    
                                <label for="silo" class="block text-sm font-medium text-gray-700 mb-1 mt-2">Silo</label>
                                <select id="silo" name="silo" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Seleccione un silo</option>
                                </select>
    
                                <div class="mt-2">
                                    <label for="cantidad" class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                    <input type="number" id="cantidad" name="cantidad" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ingrese la cantidad" required>
                                </div>
    
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
    
                                <div class="mt-2">
                                    <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                    <input type="text" id="observaciones" name="observaciones" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Ingrese su observacion">
                                </div>
                            </div>
                        </div>
                        <div id="notification" class="mt-4 alert" style="display:none;"></div>
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                        <div class="mt-6">
                            <button type="button" id="registrarSalida" class="w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                Registrar Salida Parcial
                            </button>
                        </div>
                    </form>
                </div>`,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            confirmButtonColor: '#053684',
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
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
                        $('#producto').empty();
                        if (response.error) {
                            $('#notification').html('<div class="alert alert-danger">Error al obtener productos</div>').fadeIn();
                            return;
                        } else if (response.mensaje) {
                            $('#notification').html('<div class="alert alert-warning">No se encontraron productos</div>').fadeIn();
                            return;
                        }
                        
                        if (Array.isArray(response)) {
                            response.forEach(producto => {
                                if (producto.codigo && producto.descripcion) {
                                    $('#producto').append(new Option(producto.descripcion, producto.codigo));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        $('#notification').html('<div class="alert alert-danger">Error al obtener productos</div>').fadeIn();
                    }
                });
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/getUnd.php',
                    method: 'POST',
                    data: { vehiculoId: id },
                    success: function(response) {
                        $('#unidadMedida').empty();
                        if (response.data && Array.isArray(response.data)) {
                            response.data.forEach(unidad => {
                                if (unidad.unidad) {
                                    $('#unidadMedida').append(new Option(unidad.unidad, unidad.unidad));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                            $('#notification').html('<div class="alert alert-danger">Error en el formato de respuesta al obtener unidades de medida</div>').fadeIn();
                        }
                    },
                    error: function(xhr, status, error) {
                        $('#notification').html('<div class="alert alert-danger">Error al obtener unidades de medida</div>').fadeIn();
                    }
                });
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/getSilos.php',
                    method: 'POST',
                    success: function(response) {
                        $('#silo').empty();
                        if (response.data && Array.isArray(response.data)) {
                            response.data.forEach(silo => {
                                if (silo.silo) {
                                    $('#silo').append(new Option(silo.silo, silo.silo));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                            $('#notification').html('<div class="alert alert-danger">Error al obtener silos</div>').fadeIn();
                        }
                    },
                    error: function(xhr, status, error) {
                        $('#notification').html('<div class="alert alert-danger">Error al obtener silos</div>').fadeIn();
                    }
                });
    
                if (!pesoBrutoInicial) {
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/getTaraCase1.php',
                        method: 'POST',
                        data: { vehiculoId: id },
                        success: function(response) {
                            pesoBrutoInicial = parseFloat(response.pesoBruto);
                            pesoActual = pesoBrutoInicial;
    
                            sessionStorage.setItem(storageKey, JSON.stringify({
                                pesoBrutoInicial,
                                pesoDescargadoTotal
                            }));
                        },
                        error: function(xhr, status, error) {
                            $('#notification').html('<div class="alert alert-danger">Error al obtener el peso bruto inicial</div>').fadeIn();
                        }
                    });
                }
    
                $("#leerPesoVehiculoCaso1").on("click", function() {
                    let $button = $(this);
                    let originalButtonText = $button.html();
    
                    $button.html('<i data-lucide="loader" class="lucide animate-spin mr-2"></i> Leyendo...').prop('disabled', true);
    
                    $.ajax({
                        url: 'http://localhost:81/index',
                        method: 'POST',
                        success: function(response) {
                            const match = response.match(/[-+]?\\d*\\.?\\d+/);
                            if (match) {
                                pesoActual = parseFloat(match[0]);
                                $('#pesoBrutoCaso1').val(pesoActual);
                            }
                        },
                        error: function(xhr, status, error) {
                            $('#notification').html('<div class="alert alert-danger">Hubo un problema al obtener el peso</div>').fadeIn();
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
                    const unidadMedidaSeleccionada = $('#unidadMedida').val();
                    const siloSeleccionado = $('#silo').val();
                    const cantidadIngresada = $('#cantidad').val();
                    const pesoBrutoActual = parseFloat($('#pesoBrutoCaso1').val());
                    const pesoDescargado = pesoBrutoInicial - pesoBrutoActual;
                    const observaciones = $('#observaciones').val();
                    console.log(observaciones) 
                
                    if (!productoSeleccionado || !unidadMedidaSeleccionada || !siloSeleccionado || !cantidadIngresada || isNaN(pesoDescargado) || pesoDescargado <= 0) {
                        $('#notification').html('<div class="alert alert-warning">Debe completar todos los campos y leer un peso válido.</div>').fadeIn();
                        return;
                    }
                
                    pesoDescargadoTotal += pesoDescargado;
                    pesoBrutoInicial = pesoBrutoActual; 
                
                    sessionStorage.setItem(storageKey, JSON.stringify({
                        pesoBrutoInicial,
                        pesoDescargadoTotal
                    }));
                
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/saveVehicleExitCase1.php',
                        method: 'POST',
                        data: {
                            vehiculoId: id,
                            producto: productoSeleccionado,
                            unidadMedida: unidadMedidaSeleccionada,
                            pesoProducto: pesoDescargado,
                            silo: siloSeleccionado,
                            cantidad: cantidadIngresada,
                            observaciones: observaciones
                        },
                        success: function(response) {
                            $('#producto option:selected').remove();
                            $('#cantidad').val('');
                            $('#pesoBrutoCaso1').val('');
    
                            if (response.status === 'pendiente') {
                                $('#notification').html(`<div class="alert alert-success">Producto ${productoSeleccionado} registrado correctamente. Quedan productos por descargar.</div>`).fadeIn().delay(1500).fadeOut();
                            } else if (response.status === 'finalizado') {
                                sessionStorage.removeItem(storageKey);
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Proceso completado',
                                    text: `Todos los productos han sido descargados. Peso Tara: ${response.tara}`,
                                    confirmButtonColor: '#053684',
                                    confirmButtonText: 'OK'
                                }).then(() => {
                                    Swal.close();
                                    cargarRegistros($('#fecha-table').val());
                                });
    
                            if ($('#print').is(':checked')) {
                                $.ajax({
                                    url: wb_subdir + '/php/vehiculos/exitTicketData.php',  
                                    method: 'POST',
                                    data: { vehiculoId: id },
                                    dataType: 'json',
                                    success: function(response) {
                                        if (response.status === 'success') {
                                            const data = response.data;
                                            
                                            $.ajax({
                                                url: 'http://127.0.0.1:81/exit',  
                                                method: 'POST',
                                                contentType: 'application/json',
                                                data: JSON.stringify({
                                                    placa: data.VHP_PLACA,
                                                    chofer: data.conductor_nombre,
                                                    cedula: data.cedula,  
                                                    //tipo: data.tipo,  
                                                    destino: data.destino,  
                                                    silo_origen: data.silo_origen,  
                                                    peso_bruto: data.peso_bruto,
                                                    peso_neto: data.peso_neto,
                                                    codigo_productos: data.codigo_productos,
                                                    producto_ingresado: data.productos,
                                                    productos_con_silos: data.productos_con_silos,
                                                }),
                                                success: function(response) {
                                                    console.log("Respuesta de salida:", response);
                                                    $('#notification').html('<div class="alert alert-success">Salida registrada correctamente.</div>').fadeIn();
                                                },
                                                error: function(xhr, status, error) {
                                                    console.error('Error al enviar los datos de salida:', error);
                                                    $('#notification').html('<div class="alert alert-danger">Error al registrar la salida.</div>').fadeIn();
                                                }
                                            });
                                        } else {
                                            console.error('Error al obtener los datos:', response.message);
                                            $('#notification').html('<div class="alert alert-danger">Error al obtener datos del vehículo.</div>').fadeIn();
                                        }
                                    },
                                    error: function(xhr, status, error) {
                                        console.error('Error en la solicitud AJAX:', error);
                                        $('#notification').html('<div class="alert alert-danger">Hubo un problema al obtener los datos de salida.</div>').fadeIn();
                                    }
                                });
                            }
                            }
                        },
                        error: function() {
                            $('#notification').html('<div class="alert alert-danger">Ocurrió un error al registrar la salida</div>').fadeIn();
                        }
                    });
                });                  
            }
        });
    }
         
    // function abrirModalCaso2(id) {
    //     $.ajax({
    //         url: wb_subdir + '/php/vehiculos/checkStatusCase1.php', 
    //         method: 'POST',
    //         data: { vehiculoId: id },
    //         success: function(response) {
    //             if (response.estatus === 'Finalizado') {
    //                 Swal.fire({
    //                     icon: 'info',
    //                     title: 'Este vehículo ya ha finalizado su proceso de descarga.',
    //                     confirmButtonText: 'OK',
    //                     confirmButtonColor: '#053684'
    //                 });
    //                 return; 
    //             } else {
    //                 iniciarModalCaso2(id);
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error('Error al verificar el estatus del vehículo:', error);
    //         }
    //     });
    // }
    
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
                         <div class="mt-2">
                                    <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                    <input type="text" id="observaciones" name="observaciones" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Ingrese su observacion">
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
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            },
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
    
                $('#formSalidaCaso2').off('submit').on('submit', function (e) {
                    e.preventDefault();

                    const $form = $(this);
                    const $submitButton = $form.find('button[type="submit"]');
                    $submitButton.prop('disabled', true).text('Procesando...');
                
                    let formData = new FormData(this);
                
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/saveVehicleExitCase2.php',
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Salida registrada',
                                text: 'El vehículo ha salido exitosamente.',
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                if ($('#print').is(':checked')) {
                                    $.ajax({
                                        url: wb_subdir + '/php/vehiculos/exitTicketData.php',
                                        method: 'POST',
                                        data: { vehiculoId: id },
                                        dataType: 'json',
                                        success: function (response) {
                                            if (response.status === 'success') {
                                                const data = response.data;
                
                                                $.ajax({
                                                    url: 'http://127.0.0.1:81/exit',
                                                    method: 'POST',
                                                    contentType: 'application/json',
                                                    data: JSON.stringify({
                                                        placa: data.VHP_PLACA,
                                                        chofer: data.conductor_nombre,
                                                        cedula: data.cedula,
                                                        destino: data.destino,
                                                        silo_origen: data.silo_origen,
                                                        peso_bruto: data.peso_bruto,
                                                        peso_neto: data.peso_neto,
                                                        codigo_productos: data.codigo_productos,
                                                        producto_ingresado: data.productos,
                                                        productos_con_silos: data.productos_con_silos,
                                                    }),
                                                    success: function (printResponse) {
                                                        console.log("Respuesta de impresión:", printResponse);
                                                        $('#notification').html('<div class="alert alert-success">Salida registrada e impresión realizada correctamente.</div>').fadeIn();
                                                    },
                                                    error: function (xhr, status, error) {
                                                        console.error('Error al enviar los datos de impresión:', error);
                                                        $('#notification').html('<div class="alert alert-danger">Error al realizar la impresión.</div>').fadeIn();
                                                    }
                                                });
                                            } else {
                                                console.error('Error al obtener datos del ticket:', response);
                                            }
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error al obtener datos para impresión:', error);
                                        }
                                    });
                                }
                                cargarRegistros($('#fecha-table').val());
                            });
                        },
                        error: function () {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Ocurrió un error al registrar la salida.',
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            });
                        },
                        complete: function () {
                            $submitButton.prop('disabled', false).text('Registrar Salida');
                        }
                    });
                });                                
            }
        });
    }    
    
    $('#period').on('change', function () {
        let selectedPeriod = $(this).val();
        let today = new Date();
        let startDate = '';
        let endDate = '';
    
        function formatDate(date) {
            let d = date.getDate().toString().padStart(2, '0');
            let m = (date.getMonth() + 1).toString().padStart(2, '0');
            let y = date.getFullYear();
            return `${y}-${m}-${d}`;
        }
    
        if (selectedPeriod) {
            $('#dateRange').show();
            $('#fecha-table').prop('disabled', selectedPeriod !== 'diario');
        } else {
            $('#dateRange').hide();
            $('#startDate').prop('disabled', false).val('');
            $('#endDate').prop('disabled', false).val('');
            $('#fecha-table').prop('disabled', true);
            return;
        }
    
        switch (selectedPeriod) {
            case 'diario':
                startDate = formatDate(today);
                endDate = formatDate(today);
                $('#startDate, #endDate').prop('disabled', true);
                $('#fecha-table').on('change', function() {
                    let fechaSeleccionada = $(this).val();
                        cargarRegistros(fechaSeleccionada);
                });
                break;
            case 'semanal':
                startDate = formatDate(new Date(today.setDate(today.getDate() - today.getDay())));
                endDate = formatDate(new Date(today.setDate(today.getDate() + 6)));
                break;
            case 'quincenal':
                startDate = formatDate(new Date(today.setDate(today.getDate() - 14)));
                endDate = formatDate(new Date());
                break;
            case 'mensual':
                startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case 'bimestral':
                startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
                endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case 'trimestral':
                startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 1));
                endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case 'semestral':
                startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 5, 1));
                endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case 'anual':
                startDate = formatDate(new Date(today.getFullYear(), 0, 1));
                endDate = formatDate(new Date(today.getFullYear(), 11, 31));
                break;
            case 'indicada':
                $('#dateRange').show();
                $('#startDate').prop('disabled', false).val('');
                $('#endDate').prop('disabled', false).val('');
                return; 
            default:
                startDate = '';
                endDate = '';
                $('#startDate, #endDate').prop('disabled', true);
                $('#fecha-table').prop('disabled', true);
                return;
        }

        $('#startDate').val(startDate).prop('disabled', true);
        $('#endDate').val(endDate).prop('disabled', true);
    
        if (startDate && endDate) {
            cargarRegistros(null, startDate, endDate);
        }
    });
    
    $('#startDate, #endDate').on('change', function () {
        if ($('#period').val() === 'indicada') {
            let fechaInicio = $('#startDate').val();
            let fechaFin = $('#endDate').val();
    
            if (fechaInicio && fechaFin) {
                cargarRegistros(null, fechaInicio, fechaFin);
            }
        }
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
    
    //DATE INPUTS
    $('#dateRange').hide();
    $('#startDate').prop('disabled', true).val('');
    $('#endDate').prop('disabled', true).val('');
    $('#fecha-table').show(); 
    $('#fecha-table').prev('label').show(); 

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
            //vehiculo_activo: 'Sí',
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

            if ($('#print').is(':checked')) {
                $.ajax({
                    url: 'http://127.0.0.1:81/entry',  
                    method: 'POST',
                    contentType: 'application/json',  
                    data: JSON.stringify({  
                        placa: data.placa,
                        chofer: data.conductor,
                        cedula: data.cedula,
                        tipo: data.tipo,
                        peso_bruto: data.peso_bruto,
                        fecha_peso_bruto: data.fecha_peso_bruto,
                        hora_entrada: data.hora_entrada,
                        codigo_productos: data.codigo_productos,
                        producto_ingresado: data.producto_ingresado
                    }),
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', error);
                    }
                ,
                    success: function() {
                        console.log("Ticket de entrada generado exitosamente.");
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al generar el ticket de entrada:', error);
                        Swal.fire('Error al generar el ticket de entrada', '', 'error');
                    }
                });
            }
    
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
