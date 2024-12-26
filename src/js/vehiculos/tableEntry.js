jQuery(document).ready(function($) {

    let port_number = 'COM2'; 

    $('#portNumber').on('click', function() {
        port_number = $('#portNumber').val() || 'COM7';
        if (port_number !== 'COM7' && port_number !== null) {
            port_number = 'COM2';
        }
    });
    
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
        let data = fechaInicio && fechaFin ? { startDate: fechaInicio, endDate: fechaFin } : { fecha: fecha };
        let tbody = $('#default-table tbody');
    
        tbody.empty().append(`<tr><td colspan="13" class="text-center"><div class="spinner-container"><div class="spinner"></div></div></td></tr>`);
    
        $('<style>').prop('type', 'text/css').html(`
            .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
            .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #1e3a8a; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 10px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `).appendTo('head');
    
        $.ajax({
            url: wb_subdir + '/php/vehiculos/loadVehicleDataTable.php',
            method: 'POST',
            data: data,
            dataType: 'JSON',
            success: function(response) {
                if (table) table.destroy();
                table = new simpleDatatables.DataTable("#default-table", {
                    perPage: 30,
                    perPageSelect: [5, 10, 20, 30, 40, 50, 60],
                    data: {
                        headings: ["Número", "Placa", "Conductor", "Peso Entrada", "Peso Salida", "Peso Neto", "Fecha Entrada", "Fecha Salida", "Hora Entrada", "Hora Salida", "Producto Ingresado", "Producto despachado","Estado", "Acciones"],
                        data: response.map(registro => {
                            const estatusClass = registro.estatus === 'Pendiente' ? 'row-pendiente' : registro.estatus === 'Finalizado' ? 'row-finalizado' : '';
                            const casoText = ['Producto', 'Múltiple', 'Vacío'][registro.caso] || '-';
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
                                `<span class="font-bold">${registro.producto_ingresado || 'Vacío'}</span>`,
                                `<span class="font-bold">${registro.producto_despachado || 'Vacío'}</span>`,
                                `<span class="${estatusClass}">${registro.estatus}</span>`,
                                registro.estatus === 'Pendiente' 
                                    ? `<span class="font-bold flex justify-center items-center">Vacío</span>`
                                    : registro.estatus === 'Finalizado' && (registro.producto_ingresado || registro.producto_despachado)
                                    ? `<div class="flex justify-center items-center">
                                            <button type="button" 
                                                    class="inline-flex items-center justify-center w-8 h-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onclick="genDoc('${registro.id}')">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check">
                                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 1 2 2h2"/>
                                                    <path d="m9 14 2 2 4-4"/>
                                                </svg>
                                            </button>
                                        </div>`
                                    : ''
                            ];
                        })
                    }
                });

                window.genDoc = function(id) {
                    Swal.fire({
                        title: 'Cargando',
                        //text: 'Cargando',
                        didOpen: () => {
                              Swal.showLoading(); 
                        },
                        showClass: {
                           popup: `animate__animated animate__fadeInUp animate__faster`
                        },
                        // hideClass: {
                        //     popup: `animate__animated animate__fadeOutDown animate__faster`
                        // },
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                         showConfirmButton: false
                    });
                    $.ajax({
                        url: wb_subdir + '/php/documentos/generateDocument.php',
                        method: 'POST',
                        data: {
                            vehiculoId: id
                        },
                        success: function(response) {
                            const data = JSON.parse(response);
                
                            if (data.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Documento encontrado',
                                    confirmButtonColor: '#053684',
                                    confirmButtonText: 'Ver PDF'
                                }).then(() => {
                                    if (data.redirectUrl) {
                                        window.open(data.redirectUrl, '_blank');
                                    }
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: data.message,
                                    confirmButtonText: 'OK'
                                });
                            }
                        },
                        error: function(xhr, status, error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un problema con la solicitud.',
                                confirmButtonText: 'OK'
                            });
                        },
                        complete: function() {
                        }
                    });
                };
    
                $(document).off('click', '#default-table tbody tr').on('click', '#default-table tbody tr', function() {
                    const id = $(this).find('td:first').text().trim();
                    const estatus = $(this).find('td').eq(12).text().trim();
                    if (!id) return console.error('El ID no fue encontrado en la fila seleccionada.');
    
                    if (estatus === 'Finalizado') {
                        //console.log('Caso finalizado');
                        Swal.close();
                        return;
                    } else if(estatus === '') { 
                        console.log('Sin caso.');
                        Swal.close();
                        return;
                    }
    
                    Swal.fire({
                        title: 'Cargando',
                        didOpen: () => Swal.showLoading(),
                        showClass: { popup: `animate__animated animate__fadeInUp animate__faster` },
                        hideClass: { popup: `animate__animated animate__fadeOutDown animate__faster` },
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false
                    });
    
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/checkStatusCase1.php',
                        method: 'POST',
                        data: { vehiculoId: id },
                        success: function(response) {
                            if (response && response.case) {
                                manejarCaso(id, response.case, response.estatus);
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'No se recibió un caso válido.'
                                });
                            }
                        },
                        error: function() {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un problema al cargar los registros.'
                            });
                        }
                    });
                });
    
                function manejarCaso(id, tipoCaso, estatus) {
                    const casos = ['Producto', 'Múltiple', 'Vacío'];
                    const acciones = [iniciarModalCaso0, iniciarModalCaso1, iniciarModalCaso2];
                    const index = casos.indexOf(tipoCaso);
                
                    if (index >= 0 && estatus !== 'Finalizado') {
                        setTimeout(() => {
                            acciones[index](id);
                        }, 500); 
                    }
                }                
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar los registros:', error);
                tbody.empty().append(`<tr><td colspan="13" class="text-center text-red-500">Error al cargar los registros</td></tr>`);
            }
        });
    }

    // function cargarRegistros(fecha, fechaInicio, fechaFin) {
    //     let data = fechaInicio && fechaFin ? { startDate: fechaInicio, endDate: fechaFin } : { fecha: fecha };
    //     let tbody = $('#default-table tbody');
    
    //     tbody.empty().append(`
    //         <tr>
    //             <td colspan="13" class="text-center">
    //                 <div class="spinner-container">
    //                     <div class="spinner"></div>
    //                 </div>
    //             </td>
    //         </tr>
    //     `);
    
    //     $('<style>')
    //         .prop('type', 'text/css')
    //         .html(`
    //             .spinner-container {
    //                 display: flex;
    //                 flex-direction: column;
    //                 align-items: center;
    //                 justify-content: center;
    //                 padding: 20px;
    //             }
    //             .spinner {
    //                 border: 4px solid #f3f3f3;
    //                 border-top: 4px solid #1e3a8a;
    //                 border-radius: 50%;
    //                 width: 40px;
    //                 height: 40px;
    //                 animation: spin 1s linear infinite;
    //                 margin-bottom: 10px;
    //             }
    //             @keyframes spin {
    //                 0% { transform: rotate(0deg); }
    //                 100% { transform: rotate(360deg); }
    //             }
    //         `).appendTo('head');
    
    //     $.ajax({
    //         url: wb_subdir + '/php/vehiculos/loadVehicleDataTable.php',
    //         method: 'POST',
    //         data: data,
    //         dataType: 'JSON',
    //         success: function (response) {
    //             if ($.fn.DataTable.isDataTable('#default-table')) {
    //                 $('#default-table').DataTable().destroy();
    //             }
    
    //             $('#default-table').DataTable({
    //                 data: response.map(registro => {
    //                     const estatusClass = registro.estatus === 'Pendiente' ? 'row-pendiente' : registro.estatus === 'Finalizado' ? 'row-finalizado' : '';
    //                     const casoText = ['Producto', 'Múltiple', 'Vacío'][registro.caso] || '-';
    //                     return [
    //                         registro.id,
    //                         `<span class="font-bold">${registro.VHP_PLACA}</span>`,
    //                         `<span class="font-bold">${registro.conductor_nombre}</span>`,
    //                         `<span class="font-bold">${registro.peso_bruto || '-'}</span>`,
    //                         `<span class="font-bold">${registro.peso_salida || '-'}</span>`,
    //                         `<span class="font-bold">${registro.peso_neto || '-'}</span>`,
    //                         `<span class="font-bold">${registro.fecha_entrada || '-'}</span>`,
    //                         `<span class="font-bold">${registro.fecha_salida || '-'}</span>`,
    //                         `<span class="font-bold">${registro.hora_entrada}</span>`,
    //                         `<span class="font-bold">${registro.hora_salida || 'Vacío'}</span>`,
    //                         `<span class="font-bold">${registro.producto_ingresado || 'Vacío'}</span>`,
    //                         `<span class="font-bold">${registro.producto_despachado || 'Vacío'}</span>`,
    //                         `<span class="${estatusClass}">${registro.estatus}</span>`,
    //                         registro.estatus === 'Pendiente'
    //                             ? `<span class="font-bold flex justify-center items-center">Vacío</span>`
    //                             : registro.estatus === 'Finalizado' && (registro.producto_ingresado || registro.producto_despachado)
    //                                 ? `<center><button type="button" 
    //                                            class="inline-flex items-center justify-center w-8 h-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    //                                            onclick="genDoc('${registro.id}')">
    //                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check">
    //                                             <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    //                                             <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 1 2 2h2"/>
    //                                             <path d="m9 14 2 2 4-4"/>
    //                                         </svg>
    //                                     </button></center>`
    //                                 : ''
    //                     ];
    //                 }),
    //                 columns: [
    //                     { title: "Número" },
    //                     { title: "Placa" },
    //                     { title: "Conductor" },
    //                     { title: "Peso Entrada" },
    //                     { title: "Peso Salida" },
    //                     { title: "Peso Neto" },
    //                     { title: "Fecha Entrada" },
    //                     { title: "Fecha Salida" },
    //                     { title: "Hora Entrada" },
    //                     { title: "Hora Salida" },
    //                     { title: "Producto Ingresado" },
    //                     { title: "Producto Despachado" },
    //                     { title: "Estado" },
    //                     { title: "Acciones", orderable: false, searchable: false }
    //                 ],
    //                 pageLength: 30,
    //                 lengthMenu: [5, 10, 20, 30, 40, 50],
    //                 language: {
    //                     "processing": "Procesando...",
    //                     "lengthMenu": "Mostrar _MENU_ registros",
    //                     "zeroRecords": "No se encontraron resultados",
    //                     "emptyTable": "Ningún dato disponible en esta tabla",
    //                     "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    //                     "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    //                     "search": "Buscar:",
    //                     "loadingRecords": "Cargando...",
    //                     "paginate": {
    //                         "first": "<<",
    //                         "last": ">>",
    //                         "next": ">",
    //                         "previous": "<"
    //                     },
    //                     "aria": {
    //                         "sortAscending": ": Activar para ordenar la columna de manera ascendente",
    //                         "sortDescending": ": Activar para ordenar la columna de manera descendente"
    //                     },
    //                     "buttons": {
    //                         "copy": "Copiar",
    //                         "colvis": "Visibilidad",
    //                         "collection": "Colección",
    //                         "colvisRestore": "Restaurar visibilidad",
    //                         "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
    //                         "copySuccess": {
    //                             "1": "Copiada 1 fila al portapapeles",
    //                             "_": "Copiadas %ds fila al portapapeles"
    //                         },
    //                         "copyTitle": "Copiar al portapapeles",
    //                         "csv": "CSV",
    //                         "excel": "Excel",
    //                         "pageLength": {
    //                             "-1": "Mostrar todas las filas",
    //                             "_": "Mostrar %d filas"
    //                         },
    //                         "pdf": "PDF",
    //                         "print": "Imprimir",
    //                         "renameState": "Cambiar nombre",
    //                         "updateState": "Actualizar",
    //                         "createState": "Crear Estado",
    //                         "removeAllStates": "Remover Estados",
    //                         "removeState": "Remover",
    //                         "savedStates": "Estados Guardados",
    //                         "stateRestore": "Estado %d"
    //                     },
    //                     "autoFill": {
    //                         "cancel": "Cancelar",
    //                         "fill": "Rellene todas las celdas con <i>%d<\/i>",
    //                         "fillHorizontal": "Rellenar celdas horizontalmente",
    //                         "fillVertical": "Rellenar celdas verticalmente"
    //                     },
    //                     "decimal": ",",
    //                     "searchBuilder": {
    //                         "add": "Añadir condición",
    //                         "button": {
    //                             "0": "Constructor de búsqueda",
    //                             "_": "Constructor de búsqueda (%d)"
    //                         },
    //                         "clearAll": "Borrar todo",
    //                         "condition": "Condición",
    //                         "conditions": {
    //                             "date": {
    //                                 "before": "Antes",
    //                                 "between": "Entre",
    //                                 "empty": "Vacío",
    //                                 "equals": "Igual a",
    //                                 "notBetween": "No entre",
    //                                 "not": "Diferente de",
    //                                 "after": "Después",
    //                                 "notEmpty": "No Vacío"
    //                             },
    //                             "number": {
    //                                 "between": "Entre",
    //                                 "equals": "Igual a",
    //                                 "gt": "Mayor a",
    //                                 "gte": "Mayor o igual a",
    //                                 "lt": "Menor que",
    //                                 "lte": "Menor o igual que",
    //                                 "notBetween": "No entre",
    //                                 "notEmpty": "No vacío",
    //                                 "not": "Diferente de",
    //                                 "empty": "Vacío"
    //                             },
    //                             "string": {
    //                                 "contains": "Contiene",
    //                                 "empty": "Vacío",
    //                                 "endsWith": "Termina en",
    //                                 "equals": "Igual a",
    //                                 "startsWith": "Empieza con",
    //                                 "not": "Diferente de",
    //                                 "notContains": "No Contiene",
    //                                 "notStartsWith": "No empieza con",
    //                                 "notEndsWith": "No termina con",
    //                                 "notEmpty": "No Vacío"
    //                             },
    //                             "array": {
    //                                 "not": "Diferente de",
    //                                 "equals": "Igual",
    //                                 "empty": "Vacío",
    //                                 "contains": "Contiene",
    //                                 "notEmpty": "No Vacío",
    //                                 "without": "Sin"
    //                             }
    //                         },
    //                         "data": "Data",
    //                         "deleteTitle": "Eliminar regla de filtrado",
    //                         "leftTitle": "Criterios anulados",
    //                         "logicAnd": "Y",
    //                         "logicOr": "O",
    //                         "rightTitle": "Criterios de sangría",
    //                         "title": {
    //                             "0": "Constructor de búsqueda",
    //                             "_": "Constructor de búsqueda (%d)"
    //                         },
    //                         "value": "Valor"
    //                     },
    //                     "searchPanes": {
    //                         "clearMessage": "Borrar todo",
    //                         "collapse": {
    //                             "0": "Paneles de búsqueda",
    //                             "_": "Paneles de búsqueda (%d)"
    //                         },
    //                         "count": "{total}",
    //                         "countFiltered": "{shown} ({total})",
    //                         "emptyPanes": "Sin paneles de búsqueda",
    //                         "loadMessage": "Cargando paneles de búsqueda",
    //                         "title": "Filtros Activos - %d",
    //                         "showMessage": "Mostrar Todo",
    //                         "collapseMessage": "Colapsar Todo"
    //                     },
    //                     "select": {
    //                         "cells": {
    //                             "1": "1 celda seleccionada",
    //                             "_": "%d celdas seleccionadas"
    //                         },
    //                         "columns": {
    //                             "1": "1 columna seleccionada",
    //                             "_": "%d columnas seleccionadas"
    //                         },
    //                         "rows": {
    //                             "1": "1 fila seleccionada",
    //                             "_": "%d filas seleccionadas"
    //                         }
    //                     },
    //                     "thousands": ".",
    //                     "datetime": {
    //                         "previous": "Anterior",
    //                         "hours": "Horas",
    //                         "minutes": "Minutos",
    //                         "seconds": "Segundos",
    //                         "unknown": "-",
    //                         "amPm": [
    //                             "AM",
    //                             "PM"
    //                         ],
    //                         "months": {
    //                             "0": "Enero",
    //                             "1": "Febrero",
    //                             "10": "Noviembre",
    //                             "11": "Diciembre",
    //                             "2": "Marzo",
    //                             "3": "Abril",
    //                             "4": "Mayo",
    //                             "5": "Junio",
    //                             "6": "Julio",
    //                             "7": "Agosto",
    //                             "8": "Septiembre",
    //                             "9": "Octubre"
    //                         },
    //                         "weekdays": {
    //                             "0": "Dom",
    //                             "1": "Lun",
    //                             "2": "Mar",
    //                             "4": "Jue",
    //                             "5": "Vie",
    //                             "3": "Mié",
    //                             "6": "Sáb"
    //                         },
    //                         "next": "Próximo"
    //                     },
    //                     "editor": {
    //                         "close": "Cerrar",
    //                         "create": {
    //                             "button": "Nuevo",
    //                             "title": "Crear Nuevo Registro",
    //                             "submit": "Crear"
    //                         },
    //                         "edit": {
    //                             "button": "Editar",
    //                             "title": "Editar Registro",
    //                             "submit": "Actualizar"
    //                         },
    //                         "remove": {
    //                             "button": "Eliminar",
    //                             "title": "Eliminar Registro",
    //                             "submit": "Eliminar",
    //                             "confirm": {
    //                                 "_": "¿Está seguro de que desea eliminar %d filas?",
    //                                 "1": "¿Está seguro de que desea eliminar 1 fila?"
    //                             }
    //                         },
    //                         "error": {
    //                             "system": "Ha ocurrido un error en el sistema (<a target=\"\\\" rel=\"\\ nofollow\" href=\"\\\">Más información&lt;\\\/a&gt;).<\/a>"
    //                         },
    //                         "multi": {
    //                             "title": "Múltiples Valores",
    //                             "restore": "Deshacer Cambios",
    //                             "noMulti": "Este registro puede ser editado individualmente, pero no como parte de un grupo.",
    //                             "info": "Los elementos seleccionados contienen diferentes valores para este registro. Para editar y establecer todos los elementos de este registro con el mismo valor, haga clic o pulse aquí, de lo contrario conservarán sus valores individuales."
    //                         }
    //                     },
    //                     "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    //                     "stateRestore": {
    //                         "creationModal": {
    //                             "button": "Crear",
    //                             "name": "Nombre:",
    //                             "order": "Clasificación",
    //                             "paging": "Paginación",
    //                             "select": "Seleccionar",
    //                             "columns": {
    //                                 "search": "Búsqueda de Columna",
    //                                 "visible": "Visibilidad de Columna"
    //                             },
    //                             "title": "Crear Nuevo Estado",
    //                             "toggleLabel": "Incluir:",
    //                             "scroller": "Posición de desplazamiento",
    //                             "search": "Búsqueda",
    //                             "searchBuilder": "Búsqueda avanzada"
    //                         },
    //                         "removeJoiner": "y",
    //                         "removeSubmit": "Eliminar",
    //                         "renameButton": "Cambiar Nombre",
    //                         "duplicateError": "Ya existe un Estado con este nombre.",
    //                         "emptyStates": "No hay Estados guardados",
    //                         "removeTitle": "Remover Estado",
    //                         "renameTitle": "Cambiar Nombre Estado",
    //                         "emptyError": "El nombre no puede estar vacío.",
    //                         "removeConfirm": "¿Seguro que quiere eliminar %s?",
    //                         "removeError": "Error al eliminar el Estado",
    //                         "renameLabel": "Nuevo nombre para %s:"
    //                     },
    //                     "infoThousands": "."
    //                 } 
    //             });
    
    //             window.genDoc = function (id) {
    //                 Swal.fire({
    //                     title: 'Cargando',
    //                     didOpen: () => Swal.showLoading(),
    //                     allowOutsideClick: false,
    //                     allowEscapeKey: false,
    //                     showConfirmButton: false
    //                 });
    
    //                 $.ajax({
    //                     url: wb_subdir + '/php/documentos/generateDocument.php',
    //                     method: 'POST',
    //                     data: { vehiculoId: id },
    //                     success: function (response) {
    //                         const data = JSON.parse(response);
    
    //                         if (data.success) {
    //                             Swal.fire({
    //                                 icon: 'success',
    //                                 title: 'Documento generado',
    //                                 confirmButtonColor: '#053684',
    //                                 confirmButtonText: 'Ver PDF'
    //                             }).then(() => {
    //                                 if (data.redirectUrl) {
    //                                     window.open(data.redirectUrl, '_blank');
    //                                 }
    //                             });
    //                         } else {
    //                             Swal.fire({
    //                                 icon: 'error',
    //                                 title: 'Error',
    //                                 text: data.message
    //                             });
    //                         }
    //                     },
    //                     error: function () {
    //                         Swal.fire({
    //                             icon: 'error',
    //                             title: 'Error',
    //                             text: 'Hubo un problema con la solicitud.'
    //                         });
    //                     }
    //                 });
    //             };
    
    //             $(document).off('click', '#default-table tbody tr').on('click', '#default-table tbody tr', function () {
    //                 const id = $(this).find('td:first').text().trim();
    //                 const estatus = $(this).find('td').eq(12).text().trim();
    //                 if (!id) return console.error('El ID no fue encontrado en la fila seleccionada.');
    
    //                 if (estatus === 'Finalizado') {
    //                     Swal.close();
    //                     return;
    //                 } else if (estatus === '') {
    //                     console.log('Sin caso.');
    //                     Swal.close();
    //                     return;
    //                 }
    
    //                 Swal.fire({
    //                     title: 'Cargando',
    //                     didOpen: () => Swal.showLoading(),
    //                     allowOutsideClick: false,
    //                     allowEscapeKey: false,
    //                     showConfirmButton: false
    //                 });
    
    //                 $.ajax({
    //                     url: wb_subdir + '/php/vehiculos/checkStatusCase1.php',
    //                     method: 'POST',
    //                     data: { vehiculoId: id },
    //                     success: function (response) {
    //                         if (response && response.case) {
    //                             manejarCaso(id, response.case, response.estatus);
    //                         } else {
    //                             Swal.fire({
    //                                 icon: 'error',
    //                                 title: 'Error',
    //                                 text: 'No se recibió un caso válido.'
    //                             });
    //                         }
    //                     },
    //                     error: function () {
    //                         Swal.fire({
    //                             icon: 'error',
    //                             title: 'Error',
    //                             text: 'Hubo un problema al cargar los registros.'
    //                         });
    //                     }
    //                 });
    //             });
    
    //             function manejarCaso(id, tipoCaso, estatus) {
    //                 const casos = ['Producto', 'Múltiple', 'Vacío'];
    //                 const acciones = [iniciarModalCaso0, iniciarModalCaso1, iniciarModalCaso2];
    //                 const index = casos.indexOf(tipoCaso);
    
    //                 if (index >= 0 && estatus !== 'Finalizado') {
    //                     setTimeout(() => {
    //                         acciones[index](id);
    //                     }, 500);
    //                 }
    //             }
    //         },
    //         error: function () {
    //             tbody.empty().append(`
    //                 <tr>
    //                     <td colspan="13" class="text-center text-red-500">Error al cargar los registros</td>
    //                 </tr>
    //             `);
    //         }
    //     });
    // }
       
    function iniciarModalCaso0(id) {
        let pesoBrutoInicial = null;
        let pesoActual = null;
    
        Swal.fire({
            html: 
            `<div class="relative bg-white shadow-lg rounded-lg p-4 max-w-md mx-auto">
                <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 class="text-lg font-semibold mb-4">Salida de Vehículo - Producto Único</h2>
                
                <form id="formSalidaCaso0" class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-700">Producto</label>
                        <select id="producto" name="producto" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                        <option value="">Seleccione un producto</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700">Unidad</label>
                        <select id="unidadMedida" name="unidadMedida" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                        <option value="">Seleccione unidad</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700">Silo</label>
                        <select id="silo" name="silo" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                        <option value="">Seleccione silo</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700">Cantidad</label>
                        <input type="number" id="cantidad" name="cantidad" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700">Sica</label>
                        <input type="number" id="sica" name="sica" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                    </div>

                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-700">Proveedor</label>
                        <select id="proveedor" name="proveedor" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                        <option value="" selected disabled>Seleccione un proveedor</option>
                        </select>
                    </div>

                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-700">Neto proveedor</label>
                        <input type="text" id="netoProveedor" name="netoProveedor" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm">
                    </div>

                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-700">Peso Bruto Actual</label>
                        <div class="mt-1 flex gap-2">
                        <input type="number" id="pesoBrutoCaso0" name="pesoBruto" class="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm" required>
                        <button type="button" id="leerPesoVehiculoCaso0" class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                            Leer Peso
                        </button>
                        </div>
                    </div>

                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-700">Observaciones</label>
                        <input type="text" id="observaciones" name="observaciones" class="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm">
                    </div>
                    </div>

                    <div id="notification" class="hidden mt-3 p-2 bg-green-100 text-green-700 rounded-md text-sm"></div>
                    <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
                    
                    <button type="button" id="registrarSalida" class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                    Registrar Salida
                    </button>
                </form>
                </div>`,
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

                $('#producto').prop('disabled', true);
                $('#unidadMedida').prop('disabled', true);
                $('#silo').prop('disabled', true);
                $('#proveedor').prop('disabled', true);
            
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
                    },
                    complete: function() {
                        $('#producto').prop('disabled', false);
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
                    },
                    complete: function() {
                        $('#unidadMedida').prop('disabled', false);
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
                    },
                    complete: function() {
                        $('#silo').prop('disabled', false);
                    }
                });

                $('#proveedor').select2({
                    placeholder: 'Seleccione un proveedor',
                    allowClear: true,
                    dropdownParent: $('.swal2-popup')
                });

                $.ajax({
                    url: wb_subdir + '/php/vehiculos/providers.php',
                    method: 'POST',
                    success: function(response) {
                        const $proveedor = $('#proveedor');
                        $proveedor.empty(); 

                        $proveedor.append(new Option('Seleccione un proveedor', '', true, true));

                        if (response && Array.isArray(response)) {
                            response.forEach(proveedor => {
                                if (proveedor.codigo && proveedor.nombre) {
                                    $proveedor.append(new Option(proveedor.nombre, proveedor.nombre));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener proveedores:', error);
                    },
                    complete: function() {
                        $('#proveedor').prop('disabled', false);
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
                        url: 'http://127.0.0.1:8081/index',
                        contentType: 'application/json',
                        data: JSON.stringify({port_name: port_number}),
                        method: 'POST',
                        success: function(response) {
                            console.log('Peso: ' + response)
                            const match = response.data.match(/[-+]?\d*\.?\d+/g);
                            console.log(match)
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
                    const proveedor = $('#proveedor').val();
                    const netoProveedor = $('#netoProveedor').val();
                    const sica = $('#sica').val();

                
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
                            pesoNeto: pesoNeto,
                            sica: sica, 
                            proveedor: proveedor, 
                            netoProveedor: netoProveedor
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
                                                    url: 'http://127.0.0.1:8080/exit',
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

    function iniciarModalCaso1(id) {
        let pesoBrutoInicial = null;
        let pesoActual = null;
        let pesoDescargadoTotal = 0;

        Swal.fire({
            html: 
                `<div class="relative bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
                <button id="close-modal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 class="text-lg font-medium text-center mb-6">Salida de Vehículo - Múltiples Productos</h2>
                
                <form id="formSalidaCaso1" class="space-y-4">
                    <div id="productos-container">
                        <div id="producto-section-1">
                            <div class="mb-4">
                                <label class="block text-sm text-gray-700 mb-1">Producto</label>
                                <select id="producto" name="producto" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" required>
                                    <option value="">Seleccione un producto</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm text-gray-700 mb-1">Unidad</label>
                                    <select id="unidadMedida" name="unidadMedida" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" required>
                                        <option value="">Seleccione unidad</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm text-gray-700 mb-1">Silo</label>
                                    <select id="silo" name="silo" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" required>
                                        <option value="">Seleccione silo</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm text-gray-700 mb-1">Cantidad</label>
                                    <input type="number" id="cantidad" name="cantidad" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" placeholder="Ingrese cantidad" required>
                                </div>
                                <div>
                                    <label class="block text-sm text-gray-700 mb-1">Sica</label>
                                    <input type="number" id="sica" name="sica" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" placeholder="Ingrese sica" required>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-sm text-gray-700 mb-1">Proveedor</label>
                                <select id="proveedor" name="proveedor" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" required>
                                    <option value="" disabled selected>Seleccione un proveedor</option>
                                </select>
                            </div>

                    <div class="mb-4">
                                <label class="block text-sm text-gray-700 mb-1">Peso Neto del Proveedor</label>
                                <input type="text" id="netoProveedor" name="netoProveedor" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" placeholder="Ingrese peso neto del proveedor.">
                            </div>
                        </div>

                            <div class="mb-4">
                                <label class="block text-sm text-gray-700 mb-1">Peso Bruto Actual</label>
                                <div class="flex gap-2">
                                    <input type="number" id="pesoBrutoCaso1" name="pesoBruto" class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" placeholder="Peso del vehículo" required>
                                    <button type="button" id="leerPesoVehiculoCaso1" class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                                        Leer Peso
                                    </button>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-sm text-gray-700 mb-1">Observaciones</label>
                                <input type="text" id="observaciones" name="observaciones" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm" placeholder="Ingrese observación">
                            </div>
                        </div>
                    </div>

                    <div id="notification" class="hidden mt-4 p-3 rounded-md bg-green-50 text-green-700 text-sm"></div>
                    <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">

                    <button type="button" id="registrarSalida" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                        Registrar Salida
                    </button>
                </form>
            </div>`,
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
    
                $('#producto').prop('disabled', true);
                $('#unidadMedida').prop('disabled', true);
                $('#silo').prop('disabled', true);
                $('#proveedor').prop('disabled', true);
            
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
                    },
                    complete: function() {
                        $('#producto').prop('disabled', false);
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
                    },
                    complete: function() {
                        $('#unidadMedida').prop('disabled', false);
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
                    },
                    complete: function() {
                        $('#silo').prop('disabled', false);
                    }
                });

                $('#proveedor').select2({
                    placeholder: 'Seleccione un proveedor',
                    allowClear: true,
                    dropdownParent: $('.swal2-popup')
                });

                $.ajax({
                    url: wb_subdir + '/php/vehiculos/providers.php',
                    method: 'POST',
                    success: function(response) {
                        const $proveedor = $('#proveedor');
                        $proveedor.empty(); 

                        $proveedor.append(new Option('Seleccione un proveedor', '', true, true));

                        if (response && Array.isArray(response)) {
                            response.forEach(proveedor => {
                                if (proveedor.codigo && proveedor.nombre) {
                                    $proveedor.append(new Option(proveedor.nombre, proveedor.nombre));
                                }
                            });
                        } else {
                            console.error('Formato inesperado en la respuesta:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al obtener proveedores:', error);
                    },
                    complete: function() {
                        $('#proveedor').prop('disabled', false);
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
                        url: 'http://127.0.0.1:8080/index',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({port_name: port_number}),
                        success: function(response) {
                            const match = response.data.match(/[-+]?\d*\.?\d+/g);
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
                    const $button = $(this);
                    $button.prop('disabled', true).text('Procesando...');
                
                    const productoSeleccionado = $('#producto').val();
                    const unidadMedidaSeleccionada = $('#unidadMedida').val();
                    const siloSeleccionado = $('#silo').val();
                    const cantidadIngresada = $('#cantidad').val();
                    const pesoBrutoActual = parseFloat($('#pesoBrutoCaso1').val());
                    const pesoDescargado = pesoBrutoInicial - pesoBrutoActual;
                    const observaciones = $('#observaciones').val();
                    const proveedor = $('#proveedor').val();
                    const netoProveedor = $('#netoProveedor').val();
                    const sica = $('#sica').val();
                
                    if (!productoSeleccionado || !unidadMedidaSeleccionada || !siloSeleccionado || !cantidadIngresada || isNaN(pesoDescargado) || pesoDescargado <= 0) {
                        $('#notification').html('<div class="alert alert-warning">Debe completar todos los campos y leer un peso válido.</div>').fadeIn();
                        $button.prop('disabled', false).text('Registrar Salida');
                        return;
                    }
                
                    pesoDescargadoTotal += pesoDescargado;
                    pesoBrutoInicial = pesoBrutoActual; 
                
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
                            observaciones: observaciones,
                            proveedor: proveedor,
                            netoProveedor: netoProveedor,
                            sica: sica
                        },
                        success: function(response) {
                            $('#producto option:selected').remove();
                            $('#cantidad').val('');
                            $('#pesoBrutoCaso1').val('');
                
                            if (response.status === 'pendiente') {
                                $('#notification').html(`<div class="alert alert-success">Producto ${productoSeleccionado} registrado correctamente. Quedan productos por descargar.</div>`).fadeIn().delay(1500).fadeOut();
                            } else if (response.status === 'finalizado') {
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
                                                    url: 'http://127.0.0.1:8080/exit',  
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
                            $button.prop('disabled', false).text('Registrar Salida');
                        },
                        error: function() {
                            $('#notification').html('<div class="alert alert-danger">Ocurrió un error al registrar la salida</div>').fadeIn();
                            $button.prop('disabled', false).text('Registrar Salida');
                        }
                    });
                });                                  
            }
        });
    }

    function iniciarModalCaso2(id) {
        Swal.fire({
            html: `
                <div class="relative bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
    
                    <form novalidate id="formSalidaCaso2" class="space-y-6">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900 text-center">Tipo de Salida</h3>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <input type="checkbox" id="salidaVaciaCaso2" class="tipo-salida h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <label for="salidaVaciaCaso2" class="ml-3 block text-sm text-gray-900">Salida Vacía</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="despachoMateriaPrimaCaso2" class="tipo-salida h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <label for="despachoMateriaPrimaCaso2" class="ml-3 block text-sm text-gray-900">Despacho de Materia Prima</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="despachoProductoTerminadoCaso2" class="tipo-salida h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <label for="despachoProductoTerminadoCaso2" class="ml-3 block text-sm text-gray-900">Despacho de Producto Terminado</label>
                                </div>
                            </div>
                        </div>
    
                        <div class="space-y-6">
                            <div id="selectProductosCaso2" class="hidden">
                                <label for="productosCaso2" class="block text-sm font-medium text-gray-700 mb-2">Productos</label>
                                <select id="multipleProductSelectCaso2" multiple class="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"></select>
                                <div id="productosPesosCaso2" class="mt-6 space-y-4 hidden"></div>
                            </div>
    
                            <div id="pesoLeerCaso2" class="hidden">
                                <label for="pesoBrutoCaso2" class="block text-sm font-medium text-gray-700 mb-2">Peso Bruto</label>
                                <div class="flex space-x-4">
                                    <input type="number" id="pesoBrutoCaso2" name="pesoBruto" 
                                        class="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Peso del vehículo" required>
                                    <button type="button" id="leerPesoVehiculoCaso2" 
                                            class="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                                        Leer Peso
                                    </button>
                                </div>
                            </div>

                            <div id="campoDestinoCaso2" class="hidden">
                                <label for="destinosCaso2" class="block text-sm font-medium text-gray-700 mb-2">Destino</label>
                                <input type="text" required id="destinoCaso2" name="destinoCaso2"
                                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Ingrese el destino"></input>
                            </div>
    
                            <div id="campoObservacionesCaso2" class="hidden">
                                <label for="observacionesCaso2" class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                                <textarea id="observacionesCaso2" name="observaciones" rows="4"
                                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Ingrese observaciones"></textarea>
                            </div>

                            <div id="campoPrecintosCaso2" class="hidden">
                                <label for="precintosCaso2" class="block text-sm font-medium text-gray-700 mb-2">Precintos</label>
                                <select id="multiplePrecintosCaso2" multiple class="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></select>
                            </div>
                        </div>
    
                        <input type="hidden" id="vehiculoId" name="vehiculoId" value="${id}">
    
                        <button type="submit" id="registrarSalidaBtn" class="w-full px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors duration-200" disabled>
                            Registrar Salida
                        </button>
                    </form>
                </div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
                popup: 'swal2-popup-large'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            },
            didOpen: () => {
                $("#close-modal").on("click", function () {
                    Swal.close();
                });
    
                function toggleFields() {
                    $(".tipo-salida").on("change", function () {
                        $(".tipo-salida").not(this).prop("checked", false);
                        const selected = $(".tipo-salida:checked").length ? this.id : null;
                        updateFields(selected);
                        $("#registrarSalidaBtn").prop("disabled", !$(".tipo-salida:checked").length);
                    });
                }
    
                function updateFields(selected) {
                    $("#selectProductosCaso2, #pesoLeerCaso2, #campoObservacionesCaso2, #campoPrecintosCaso2").addClass("hidden");
                    $("#productosPesosCaso2").empty().addClass("hidden");
                    $("#multipleProductSelectCaso2").val(null).trigger("change");
                    $("#multiplePrecintosCaso2").val(null).trigger("change");
                    $("#pesoBrutoCaso2").val("");
                    $("#observacionesCaso2").val("");
    
                    if (!selected) {
                        $('#campoDestinoCaso2').addClass('hidden');
                        return;
                    }
    
                    if (selected === "salidaVaciaCaso2") {
                        $("#productosPesosCaso2").empty().addClass("hidden");
                        $("#pesoLeerCaso2, #campoObservacionesCaso2").removeClass("hidden"); 
                        initializeProductSelect(false); 
                    } else if (selected === "despachoMateriaPrimaCaso2") {
                        $("#productosPesosCaso2").empty().addClass("hidden");
                        $("#selectProductosCaso2, #pesoLeerCaso2, #campoObservacionesCaso2, #campoDestinoCaso2").removeClass("hidden");
                        initializeProductSelect(false); 
                    } else if (selected === "despachoProductoTerminadoCaso2") {
                        $("#selectProductosCaso2, #pesoLeerCaso2, #campoPrecintosCaso2, #campoDestinoCaso2").removeClass("hidden");
                        initializeProductSelect(true); 
                        initializePrecintosSelect();
                    }
                }
    
                function initializeProductSelect(showWeights) {
                    $("#multipleProductSelectCaso2").select2({
                        placeholder: "Seleccione productos",
                        allowClear: true,
                        dropdownParent: $(".swal2-popup"),
                    });

                    $("#leerPesoVehiculoCaso2").on("click", function() {
                        let $button = $(this);
                        let originalButtonText = $button.html();
        
                        $button.html('<i></i> Leyendo...').prop('disabled', true);
        
                        $.ajax({
                            url: 'http://127.0.0.1:8080/index',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({port_name: port_number}),
                            success: function(response) {
                                console.log('Peso: ' + response)
                                const match = response.data.match(/[-+]?\d*\.?\d+/g);
                                console.log(match)
                                if (match) {
                                    pesoActual = parseFloat(match[0]);
                                    $('#pesoBrutoCaso2').val(pesoActual);
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
    
                    $.ajax({
                        url: wb_subdir + "/php/inventario/productsCode.php",
                        method: "POST",
                        success: function (response) {
                            const $productos = $("#multipleProductSelectCaso2");
                            $productos.empty();
    
                            if (response.data && Array.isArray(response.data)) {
                                response.data.forEach((producto) => {
                                    if (producto.codigo && producto.nombre) {
                                        $productos.append(new Option(producto.nombre, producto.codigo));
                                    }
                                });
                            } else {
                                console.error("Formato inesperado en la respuesta:", response);
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error al obtener productos:", error);
                        },
                    });
    
                    $("#multipleProductSelectCaso2").on("change", function () {
                        const productosSeleccionados = $(this).val();
                        const $productosPesos = $("#productosPesosCaso2");
    
                        if (showWeights) {
                            const valoresExistentes = {};
                            $productosPesos.find("input[type='number']").each(function () {
                                const productoId = $(this).attr("name").replace("peso_", "");
                                valoresExistentes[productoId] = $(this).val();
                            });
    
                            $productosPesos.empty();
    
                            if (productosSeleccionados && productosSeleccionados.length > 0) {
                                productosSeleccionados.forEach((producto) => {
                                    const valorExistente = valoresExistentes[producto] || "";
    
                                    const inputHtml = `
                                          <div class="flex items-center space-x-3" id="peso_${producto}">
                                            <label class="block text-sm font-medium text-gray-700">${producto}</label>
                                            <input type="number" name="peso_${producto}" value="${valorExistente}" 
                                                   class="w-1/3 px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                                   placeholder="Peso" required>
                                            <input type="number" name="cantidad_${producto}" value="" 
                                                   class="w-1/3 px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                                   placeholder="Cant." hidden>
                                            <select name="unidad_${producto}" class="w-1/3 px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                                <option value="KG" selected>KG</option>
                                                <!--option value="G">G</option-->
                                                <!--option value="LB">LB</option-->
                                                <!--option value="OZ">OZ</option-->
                                            </select>
                                        </div>`;
                                    $productosPesos.append(inputHtml);
                                });
                                $productosPesos.removeClass("hidden");
                            }
                        } else {
                            $productosPesos.empty().addClass("hidden");
                        }
                    });
                }
    
                function initializePrecintosSelect() {
                    $("#multiplePrecintosCaso2").select2({
                        tags: true,
                        tokenSeparators: [','],
                        placeholder: "Escriba y presione Enter para agregar",
                        dropdownParent: $(".swal2-popup"),
                    });
                }
    
                toggleFields();
    
                $("#formSalidaCaso2").off("submit").on("submit", function (e) {
                    e.preventDefault();
                    const $button = $(this).find('button[type="submit"]');
                    $button.prop('disabled', true).text('Procesando...');
                
                    const tipoSalida = $(".tipo-salida:checked").attr("id");
                    const pesoBruto = $("#pesoBrutoCaso2").val();
                    const productosSeleccionados = $("#multipleProductSelectCaso2").val() || [];
                    const precintos = $("#multiplePrecintosCaso2").val() || [];
                    const destino = $("#destinoCaso2").val();
                    const observaciones = $("#observacionesCaso2").val();
                
                    if (!pesoBruto || pesoBruto <= 0) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Debe ingresar un peso bruto válido.",
                        });
                        $button.prop('disabled', false).text('Registrar Salida');
                        return;
                    }
                
                    if ((tipoSalida === "despachoMateriaPrimaCaso2" || tipoSalida === "despachoProductoTerminadoCaso2") && productosSeleccionados.length === 0) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Debe seleccionar al menos un producto.",
                        });
                        $button.prop('disabled', false).text('Registrar Salida');
                        return;
                    }
                
                    if (tipoSalida === "despachoProductoTerminadoCaso2" && precintos.length === 0) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Debe ingresar al menos un precinto.",
                        });
                        $button.prop('disabled', false).text('Registrar Salida');
                        return;
                    }
                
                    const productosPesos = {};
                    $("#productosPesosCaso2")
                        .find("div[id^='peso_']")
                        .each(function () {
                            const productoId = $(this).attr("id").replace("peso_", "");
                            const peso = $(this).find("input[name^='peso_']").val();
                            const unidad = $(this).find("select[name^='unidad_']").val();
                
                            if (!peso || peso <= 0) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: `Debe ingresar un peso válido para el producto ${productoId}.`,
                                });
                                $button.prop('disabled', false).text('Registrar Salida');
                                return false;
                            }
                
                            productosPesos[productoId] = {
                                peso: parseFloat(peso),
                                unidad: unidad,
                            };
                        });
                
                    const data = {
                        vehiculoId: id,
                        tipoSalida,
                        pesoBruto,
                        productosSeleccionados,
                        productosPesos,
                        destino,
                        precintos,
                        observaciones,
                    };
                
                    $.ajax({
                        url: wb_subdir + "/php/vehiculos/saveVehicleExitCase2.php",
                        method: "POST",
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function () {
                            Swal.fire({
                                icon: "success",
                                title: "Salida registrada",
                                text: "El vehículo ha salido exitosamente.",
                                confirmButtonColor: "#053684",
                                confirmButtonText: "OK",
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
                                                    url: 'http://127.0.0.1:8080/exit',
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
                                cargarRegistros($("#fecha-table").val());
                            });
                            $button.prop('disabled', false).text('Registrar Salida');
                        },
                        error: function (xhr, status, error) {
                            console.error('Error al registrar la salida:', error);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Ocurrió un error al registrar la salida.",
                            });
                            $button.prop('disabled', false).text('Registrar Salida');
                        }
                    });
                });                
            },
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
            $productSelect.prop('disabled', true);
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

                    $productSelect.prop('disabled', false);
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
            $multipleProductSelect.prop('disabled', true);

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

                    $multipleProductSelect.prop('disabled', false);
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
    
        $(this).find('button[type="submit"]').prop('disabled', true);
    
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
            $('#entryForm').find('button[type="submit"]').prop('disabled', false);
            return;
        }
    
        if (caso === 0 && !$('#productSelect').val()) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe seleccionar al menos un producto',
                confirmButtonColor: '#053684',
                showConfirmButton: true
            });
            $('#entryForm').find('button[type="submit"]').prop('disabled', false);
            return;
        }
    
        if (caso === 1 && $('#multipleProductSelect').val().length < 2) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe seleccionar al menos dos productos',
                confirmButtonColor: '#053684',
                showConfirmButton: true
            });
            $('#entryForm').find('button[type="submit"]').prop('disabled', false);
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
    
        Swal.fire({
            title: 'Registrando',
            didOpen: () => {
                Swal.showLoading(); 
            },
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
    
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
                        url: 'http://127.0.0.1:8081/entry',
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
            },
            complete: function() {
                $('#entryForm').find('button[type="submit"]').prop('disabled', false);
            }
        });
    });        
});
