jQuery(document).ready(function ($) {
    $("#selectSalidas").prop("disabled", true);
    $("#selectProveedor").prop("disabled", true);
    $("#numeroSica").prop("disabled", true);
    $("#pesoProveedor").prop("disabled", true);
    $("#generarPDF").prop("disabled", true);

    const establecerFechaActual = () => {
        const hoy = new Date();
        const fechaActual = hoy.toISOString().split('T')[0];
        $("#fecha-modal").val(fechaActual);
        cargarSalidas(fechaActual);
    };
    establecerFechaActual();

    $("#fecha-modal").on("change", function () {
        const fecha = $(this).val();
        if (fecha) {
            cargarSalidas(fecha);
        }
    });

    function cargarSalidas(fecha) {
        $.ajax({
            url: wb_subdir + '/php/vehiculos/getEntrys.php',
            type: "POST",
            data: { fecha: fecha },
            dataType: "JSON",
            success: function (response) {
                const salidas = Array.isArray(response) ? response : response.data;

                if (!Array.isArray(salidas)) {
                    console.error("No se encontraron salidas válidas.");
                    return;
                }

                const selectSalidas = $("#selectSalidas");
                selectSalidas.empty();
                selectSalidas.append('<option value="" selected disabled>Seleccione una salida</option>');

                salidas.forEach(function (item) {
                    const optionText = item.VHP_PLACA + ' - ' + item.conductor_nombre;
                    selectSalidas.append(`<option value="${item.id}">${optionText}</option>`);
                });

                selectSalidas.prop("disabled", false).select2({
                    placeholder: "Seleccione una salida",
                    width: "100%"
                });
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar salidas:", error);
            }
        });
    }

    $("#selectSalidas").on("change", function () {
        const salidaId = $(this).val();
        if (salidaId) {
            cargarProveedores();
        }
    });

    function cargarProveedores() {
        $.ajax({
            url: wb_subdir + '/php/inventario/proveedores.php',
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                const proveedores = Array.isArray(response) ? response : response.data;

                if (!Array.isArray(proveedores)) {
                    console.error("No se encontraron proveedores válidos.");
                    return;
                }

                const selectProveedor = $("#selectProveedor");
                selectProveedor.empty();
                selectProveedor.append('<option value="" selected disabled>Seleccione un proveedor</option>');

                proveedores.forEach(function (item) {
                    selectProveedor.append(`<option value="${item.proveedores}">${item.proveedores}</option>`);
                });

                selectProveedor.prop("disabled", false).select2({
                    placeholder: "Seleccione un proveedor",
                    width: "100%"
                });
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }

    $("#selectProveedor").on("change", function () {
        const proveedor = $(this).val();
        if (proveedor) {
            $("#numeroSica").prop("disabled", false).focus();
        }
    });

    $("#numeroSica").on("input", function () {
        const sica = $(this).val();
        if (sica.trim() !== "") {
            $("#pesoProveedor").prop("disabled", false);
        } else {
            $("#pesoProveedor").prop("disabled", true);
        }
    });

    $("#pesoProveedor").on("input", function () {
        const peso = $(this).val();
        if (peso.trim() !== "") {
            $("#generarPDF").prop("disabled", false);
        } else {
            $("#generarPDF").prop("disabled", true);
        }
    });

    $("#generarPDF").on("click", function () {
        const proveedor = $("#selectProveedor").val();
        const vehiculoId = $('#selectSalidas').val();
        const sica = $('#numeroSica').val();
        const netoProveedor = $('#pesoProveedor').val();

        if (!proveedor || !vehiculoId || !sica || !netoProveedor) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos antes de generar el PDF.',
            });
            return;
        }

        const form = $('<form>', {
            method: 'POST',
            action: wb_subdir + "/vehiculos/documentos/recepcion",
            target: '_blank'
        });

        form.append($('<input>', { type: 'hidden', name: 'proveedor', value: proveedor }));
        form.append($('<input>', { type: 'hidden', name: 'vehiculoId', value: vehiculoId }));
        form.append($('<input>', { type: 'hidden', name: 'sica', value: sica }));
        form.append($('<input>', { type: 'hidden', name: 'netoProveedor', value: netoProveedor }));

        $('body').append(form);
        form.submit();
        form.remove();

        limpiarFormulario();
    });

    function limpiarFormulario() {
        $("#selectSalidas").prop("disabled", true).empty().append('<option value="" selected disabled>Seleccione una salida</option>');
        $("#selectProveedor").prop("disabled", true).empty().append('<option value="" selected disabled>Seleccione un proveedor</option>');
        $("#numeroSica").prop("disabled", true).val('');
        $("#pesoProveedor").prop("disabled", true).val('');
        $("#generarPDF").prop("disabled", true);
        establecerFechaActual();
    }
});
