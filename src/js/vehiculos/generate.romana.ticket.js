jQuery(document).ready(function($) {
    $('#reprintTicket').on('click', function() {
        const openSelectTicketType = () => {
            Swal.fire({
                title: 'Seleccione el tipo de ticket a reimprimir',
                input: 'select',
                inputOptions: {
                    entrada: 'Ticket de Entrada',
                    salida: 'Ticket de Salida'
                },
                preConfirm: (value) => {
                    if (!value) {
                      Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Necesario seleccionar una opción.')
                    }
                  }, 
                inputPlaceholder: 'Seleccione una opción',
                showCancelButton: true,
                confirmButtonText: 'Siguiente',
                confirmButtonColor: '#053684',
                cancelButtonText: 'Cerrar',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    const ticketType = result.value;
                    openSelectDate(ticketType);
                }
            });
        };

        const openSelectDate = (ticketType) => {
            Swal.fire({
                title: `Seleccione una fecha para ver tickets de ${ticketType}`,
                html: `<input type="date" id="select-date-${ticketType}" class="swal2-input" value="${new Date().toISOString().slice(0, 10)}">`,
                confirmButtonText: 'Buscar',
                confirmButtonColor: '#053684',
                cancelButtonText: 'Volver',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const selectedDate = document.getElementById(`select-date-${ticketType}`).value;
                    if (!selectedDate) {
                        Swal.showValidationMessage('Debe seleccionar una fecha');
                    }
                    return { ticketType, selectedDate };
                }
            }).then((dateResult) => {
                if (dateResult.isConfirmed) {
                    const { ticketType, selectedDate } = dateResult.value;
                    fetchTickets(ticketType, selectedDate);
                } else if (dateResult.dismiss === Swal.DismissReason.cancel) {
                    openSelectTicketType();
                }
            });
        };

        const fetchTickets = (ticketType, selectedDate) => {
            $.ajax({
                url: wb_subdir + '/php/vehiculos/ticketRomana.php',  
                method: 'POST',
                data: { fecha: selectedDate },
                success: function(response) {
                    const tickets = JSON.parse(response);

                    if (tickets.length > 0) {
                        let selectOptions = `<select id="select-${ticketType}" class="swal2-input">`;
                        tickets.forEach((ticket) => {
                            selectOptions += `<option value="${ticket.id}">${ticket.conductor_nombre} - ${ticket.placa}</option>`;
                        });
                        selectOptions += '</select>';
                        openSelectTicket(ticketType, selectedDate, selectOptions);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `No se encontraron tickets para la fecha ${selectedDate}.`,
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'Volver'
                        }).then(() => openSelectDate(ticketType));
                    }
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Problema para obtener los tickets.',
                        confirmButtonColor: '#053684',
                        confirmButtonText: 'Volver'
                    }).then(() => openSelectDate(ticketType));
                }
            });
        };

        const openSelectTicket = (ticketType, selectedDate, selectOptions) => {
            Swal.fire({
                title: `Seleccione un ticket de ${ticketType}`,
                html: selectOptions,
                confirmButtonText: 'Ver Ticket',
                confirmButtonColor: '#053684',
                cancelButtonText: 'Volver',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const selectedTicketId = $(`#select-${ticketType}`).val();
                    if (!selectedTicketId) {
                        Swal.showValidationMessage(`Debe seleccionar un ${ticketType}.`);
                    }
                    return selectedTicketId;
                }
            }).then((ticketResult) => {
                if (ticketResult.isConfirmed) {
                    const selectedTicketId = ticketResult.value;
                    fetchTicketDetails(ticketType, selectedTicketId);
                } else if (ticketResult.dismiss === Swal.DismissReason.cancel) {
                    openSelectDate(ticketType);
                }
            });
        };

        const fetchTicketDetails = (ticketType, selectedTicketId) => {
            $.ajax({
                url: wb_subdir + '/php/vehiculos/ticketRomana.php',
                method: 'POST',
                data: { tipo: ticketType, id_entrada: selectedTicketId },
                success: function(response) {
                    const ticketData = JSON.parse(response);

                    if (ticketData.error) {
                        Swal.fire('Error', ticketData.error, 'error').then(() => openSelectTicket(ticketType, selectedDate, selectOptions));
                    } else {
                        showTicketPreview(ticketType, ticketData);
                    }
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Hubo un problema al reimprimir el ticket de ${ticketType}.`,
                        confirmButtonColor: '#053684',
                        confirmButtonText: 'OK'
                    }).then(() => openSelectTicket(ticketType, selectedDate, selectOptions));
                }
            });
        };

        const showTicketPreview = (ticketType, ticketData) => {
            let ticketHTML = `
                <div style="width: 80mm; font-family: Arial, sans-serif; padding: 10px; margin: 0 auto; border: 1px solid #000; background-color: #fff;">
                    <div style="text-align: center; font-weight: bold; margin-bottom: 5px;">Avícola La Providencia</div>
                    <div style="text-align: center; margin-bottom: 10px;">Ticket Romana - ${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)}</div>
                    <hr style="border-top: 1px dashed #000; margin: 10px 0;">
                    <div style="margin-bottom: 5px;">Fecha: ${ticketData.VHP_FECHA}</div>
                    <div style="margin-bottom: 5px;">Chofer: ${ticketData.conductor_nombre}</div>
                    <div style="margin-bottom: 5px;">Cédula: ${ticketData.cedula}</div>
                    <div style="margin-bottom: 5px;">Placa: ${ticketData.VHP_PLACA}</div>
                    <div style="margin-bottom: 5px;">Producto: ${ticketData.productos}</div>
                    <div style="margin-bottom: 5px;">Peso Bruto: ${ticketData.peso_bruto} KG</div>`;

            if (ticketType === 'salida') {
                ticketHTML += `
                    <div style="margin-bottom: 5px;">Peso Neto: ${ticketData.peso_neto} KG</div>
                    <div style="margin-bottom: 5px;">Peso Tara: ${ticketData.peso_salida} KG</div>
                    <div style="margin-bottom: 5px;">Productos con Silos: ${ticketData.productos_con_silos}</div>`;
            }

            ticketHTML += `
                    <div style="margin-top: 10px;">Hora de Entrada: ${ticketData.hora_entrada}</div>
                    <div style="margin-top: 5px;">Hora de Salida: ${ticketData.hora_salida}</div>
                    <hr style="border-top: 1px dashed #000; margin-top: 10px;">
                </div>`;

            Swal.fire({
                title: 'Prevista',
                html: ticketHTML,
                confirmButtonText: 'Reimprimir Ticket',
                confirmButtonColor: '#053684',
                cancelButtonText: 'Volver',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    reprintTicket(ticketType, ticketData);
                } else {
                    openSelectTicket(ticketType, selectedDate, selectOptions);
                }
            });
        };

        const reprintTicket = (ticketType, ticketData) => {
            const endpoint = ticketType === 'entrada' ? '/r-entry' : '/r-exit';

            $.ajax({
                url: 'http://127.0.0.1:8080' + endpoint,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    VHP_FECHA: ticketData.VHP_FECHA,
                    hora_entrada: ticketData.hora_entrada,
                    hora_salida: ticketData.hora_salida,
                    chofer: ticketData.conductor_nombre,
                    cedula: ticketData.cedula,
                    placa: ticketData.VHP_PLACA,
                    producto_ingresado: ticketData.productos,
                    peso_bruto: ticketData.peso_bruto,
                    peso_neto: ticketData.peso_neto,
                    peso_salida: ticketData.peso_salida,
                    productos_con_silos: ticketData.productos_con_silos
                }),
                success: function(response) {
                    if (response.message === "200") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Ticket Reimpreso Exitosamente',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#053684'
                        });
                    } else {
                        Swal.fire('Error', response.error || 'Ocurrió un error al reimprimir.', 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
                }
            });
        };

        openSelectTicketType();
    });
});
