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
    jQuery(document).ready(function($) {
        $('#generateTicket').on('click', function() {
            $.ajax({
                url: wb_subdir + '/php/vehiculos/ticketRomana.php',  
                method: 'POST',
                success: function(response) {
                    const entradas = JSON.parse(response);
                    
                    if (entradas.length > 0) {
                        let selectOptions = '<select id="select-entrada" class="swal2-input">';
    
                        entradas.forEach((entrada) => {
                            selectOptions += `<option value="${entrada.id}">${entrada.conductor} - ${entrada.placa}</option>`;
                        });
                        selectOptions += '</select>';
                        Swal.fire({
                            title: 'Generar Ticket Romana',
                            html:
                                `<div class="relative bg-white shadow-lg rounded-lg p-6">
                                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none text-lg font-bold">
                                        &times;
                                    </button>
                                    <form id="ticketForm" class="space-y-4">
                                        <div>
                                            <label for="select-entrada" class="block text-sm font-medium text-gray-700">Entrada</label>
                                            ${selectOptions}
                                        </div>
                                        <div>
                                            <label for="silo" class="block text-sm font-medium text-gray-700">Silo de Carga</label>
                                            <input type="text" id="silo" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese el silo de carga" required>
                                        </div>
                                        <div>
                                            <label for="destino" class="block text-sm font-medium text-gray-700">Destino</label>
                                            <input type="text" id="destino" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese el destino" required>
                                        </div>
                                        <div class="text-center mt-4">
                                            <button type="submit" id="generate-ticket-btn" class="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Generar Ticket</button>
                                        </div>
                                    </form>
                                </div>`,
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
    
                                $("#ticketForm").on("submit", function(e) {
                                    e.preventDefault(); 
                                    
                                    const idEntrada = $('#select-entrada').val();
                                    const silo = $('#silo').val();
                                    const destino = $('#destino').val();
                                    
                                    if (!idEntrada || !silo || !destino) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Todos los campos son obligatorios.',
                                            confirmButtonColor: '#053684',
                                            confirmButtonText: 'OK'
                                        });
                                        return;
                                    }
    
                                    $.ajax({
                                        url: wb_subdir + '/php/vehiculos/ticketRomana.php', 
                                        method: 'POST',
                                        data: { id_entrada: idEntrada, silo: silo, destino: destino },
                                        success: function(response) {
                                            const data = JSON.parse(response);
    
                                            if (data.error) {
                                                Swal.fire('Error', data.error, 'error');
                                            } else {
                                                Swal.fire({
                                                    title: 'Ticket Generado',
                                                    html: `
                                                        <div style="width: 80mm; font-family: Arial, sans-serif; padding: 10px; margin: 0 auto; border: 1px solid #000; background-color: #fff;">
                                                            <div style="text-align: center; font-weight: bold; margin-bottom: 5px;">Avícola La Providencia</div>
                                                            <div style="text-align: center; margin-bottom: 10px;">Ticket Romana</div>
                                                            <hr style="border-top: 1px dashed #000; margin: 10px 0;">
                                                            <div style="margin-bottom: 5px;">Fecha: ${data.fecha}</div>
                                                            <div style="margin-bottom: 5px;">Nota: ${data.nota}</div>
                                                            <div style="margin-bottom: 5px;">Chofer: ${data.chofer}</div>
                                                            <div style="margin-bottom: 5px;">Cédula: ${data.cedula}</div>
                                                            <div style="margin-bottom: 5px;">Placa: ${data.placa}</div>
                                                            <div style="margin-bottom: 5px;">Destino: ${data.destino}</div>
                                                            <div style="margin-bottom: 5px;">Producto: ${data.producto}</div>
                                                            <div style="margin-bottom: 5px;">Peso Tara: ${data.peso_tara}</div>
                                                            <div style="margin-bottom: 5px;">Peso Bruto: ${data.peso_bruto}</div>
                                                            <div style="margin-bottom: 5px;">Peso Neto: ${data.peso_neto}</div>
                                                            <div style="border: 1px solid #000; text-align: center; padding: 5px; font-weight: bold; margin: 10px 0;">Silo de Carga: ${data.silo}</div>
                                                            <div style="margin-top: 10px;">Hora: ${data.hora}</div>
                                                            <hr style="border-top: 1px dashed #000; margin-top: 10px;">
                                                        </div>
                                                    `,
                                                    confirmButtonText: 'Ver',
                                                    confirmButtonColor: '#053684',
                                                    showCancelButton: true,
                                                    cancelButtonText: 'Cerrar'
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        const ticketContent = document.createElement('div');
                                                        ticketContent.innerHTML = `
                                                            <div style="width: 80mm; font-family: Arial, sans-serif; padding: 10px; margin: 0 auto; border: 1px solid #000; background-color: #fff;">
                                                                <div style="text-align: center; font-weight: bold; margin-bottom: 5px;">Avícola La Providencia</div>
                                                                <div style="text-align: center; margin-bottom: 10px;">Ticket Romana</div>
                                                                <hr style="border-top: 1px dashed #000; margin: 10px 0;">
                                                                <div style="margin-bottom: 5px;">Fecha: ${data.fecha}</div>
                                                                <div style="margin-bottom: 5px;">Nota: ${data.nota}</div>
                                                                <div style="margin-bottom: 5px;">Chofer: ${data.chofer}</div>
                                                                <div style="margin-bottom: 5px;">Cédula: ${data.cedula}</div>
                                                                <div style="margin-bottom: 5px;">Placa: ${data.placa}</div>
                                                                <div style="margin-bottom: 5px;">Destino: ${data.destino}</div>
                                                                <div style="margin-bottom: 5px;">Producto: ${data.producto}</div>
                                                                <div style="margin-bottom: 5px;">Peso Tara: ${data.peso_tara}</div>
                                                                <div style="margin-bottom: 5px;">Peso Bruto: ${data.peso_bruto}</div>
                                                                <div style="margin-bottom: 5px;">Peso Neto: ${data.peso_neto}</div>
                                                                <div style="border: 1px solid #000; text-align: center; padding: 5px; font-weight: bold; margin: 10px 0;">Silo de Carga: ${data.silo}</div>
                                                                <div style="margin-top: 10px;">Hora: ${data.hora}</div>
                                                                <hr style="border-top: 1px dashed #000; margin-top: 10px;">
                                                            </div>
                                                        `;
                                                        
                                                        const options = {
                                                            margin: [5, 0, 5, 0],
                                                            filename: 'ticket_romana.pdf',
                                                            image: { type: 'jpeg', quality: 0.98 },
                                                            html2canvas: { scale: 2 },
                                                            jsPDF: { unit: 'mm', format: [80, 160], orientation: 'portrait' } 
                                                        };
    
                                                        html2pdf().set(options).from(ticketContent).toPdf().get('pdf').then(function (pdf) {
                                                            const blob = pdf.output('blob');
                                                            const blobUrl = URL.createObjectURL(blob);
                                                            window.open(blobUrl);  
                                                        });
                                                    }
                                                });
                                            }
                                        },
                                        error: function() {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error',
                                                text: 'Hubo un problema al generar el ticket.',
                                                confirmButtonColor: '#053684',
                                                confirmButtonText: 'OK'
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se encontraron entradas para hoy.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Problema para obtener las entradas.',
                        confirmButtonColor: '#053684',
                        confirmButtonText: 'OK'
                    });
                }
            });
        });
    });
    