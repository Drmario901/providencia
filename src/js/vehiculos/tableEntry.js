jQuery(document).ready(function($) {
    let table;

    function cargarRegistros(fecha) {
        $.ajax({
            url: wb_subdir + '/php/vehiculos/loadVehicleDataTable.php',
            method: 'POST',
            data: { fecha: fecha },
            dataType: 'JSON',
            success: function(response) {
                let tbody = $('#default-table tbody');
                tbody.empty();

                if (response.length > 0) {
                    response.forEach(function(registro) {
                        let row = `
                            <tr data-id="${registro.id}" data-caso="${registro.caso}">
                                <td>${registro.placa}</td>
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
                        headings: ["Placa", "Tipo", "Peso - Tara", "Fecha de Peso Tara", "Hora Entrada", "Código Producto", "Producto Ingresado", "Vehículo Activo", "Peso Bruto", "Peso Neto", "Hora Salida", "Estado"],
                        data: response.map(function(registro) {
                            let estatusClass = '';
                            if (registro.estatus === 'Pendiente') {
                                estatusClass = 'row-pendiente';
                            } else if (registro.estatus === 'Finalizado') {
                                estatusClass = 'row-finalizado';
                            }
                
                            return [
                                `<span>${registro.placa}</span>`,
                                `<span>${registro.tipo}</span>`,
                                `<span>${registro.peso_tara}</span>`,
                                `<span>${registro.fecha_peso_tara}</span>`,
                                `<span>${registro.hora_entrada}</span>`,
                                `<span>${registro.codigo_productos}</span>`,
                                `<span>${registro.producto_ingresado}</span>`,
                                `<span>${registro.vehiculo_activo}</span>`,
                                `<span>${registro.peso_bruto || '-'}</span>`,
                                `<span>${registro.peso_neto || '-'}</span>`,
                                `<span>${registro.hora_salida || '-'}</span>`,
                                `<span class="${estatusClass}">${registro.estatus}</span>`
                            ];
                        })
                    }
                });
                

                $('#default-table tbody tr').on('click', function() {
                    const id = $(this).data('id');
                    const caso = $(this).data('caso');
                    abrirModal(id, caso);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar los registros:', error);
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
                    title: 'Registro agregado agregado',
                    confirmButtonColor: '#053684',
                    showConfirmButton: true
                })
                cargarRegistros($('#fecha-table').val());
            },
            error: function(xhr, status, error) {
                console.error('Error al registrar el vehículo:', error);
                Swal.fire('Error al registrar el vehículo', '', 'error');
            }
        });
    });
});
