
 function updateTimeInput() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        const formattedDateTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
        
        const hiddenInput = document.getElementById('hiddenTimeInput');
        if (hiddenInput) {
            hiddenInput.value = formattedDateTime;  
        }
}

    window.onload = function() {
        updateTimeInput(); 
        setInterval(updateTimeInput, 60000); 
    };


jQuery(document).ready(function($) {  

    //READ WEIGHT FUNCTION
    function readWeight() {
        $.ajax({
            url: 'http://localhost:81/index', 
            method: 'POST',
            success: function(response) {
                const match = response.match(/[-+]?\d*\.?\d+/);
                if (match) {
                    const peso = match[0];
                    console.log(peso)
                    $('#entryWeight').val(peso);
                }
                Swal.close();
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener el peso:', error);
                Swal.close();
            }
        });
    }

    $('#readWeight').on('click', function() {
        Swal.fire({
            title: 'Esperando peso...',
            text: 'Por favor, espera mientras se obtiene el peso.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                readWeight(); 
            }
        });
    });


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




    //REGISTER PLATE MODAL
    $('#registerPlate').on('click', function() {
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
                                <select id="vehicleType" name="vehicleType" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" required>
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Cava">Cava</option>
                                    <option value="Plataformas">Plataformas</option>
                                    <option value="Gandola">Gandola</option>
                                    <option value="PickUp">PickUp</option>
                                    <option value="Chuto">Chuto</option>
                                    <option value="Moto">Moto</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacidad (Toneladas)</label>
                                <input type="number" step="0.01" id="capacity" name="capacity" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                            </div>
                            <div>
                                <label for="taraWeight" class="block text-sm font-medium text-gray-700">Peso Tara</label>
                                <input type="number" step="0.01" id="taraWeight" name="taraWeight" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100">
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
            showClass: {
                popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
                `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
                `
            },
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });
        
                $("#newVehicleForm").on("submit", function(e) {
                    e.preventDefault(); 
                    const form = document.getElementById('newVehicleForm');
                    const formData = new FormData(form);
        
                    const plate = formData.get('plate').trim();
                    const vehicleType = formData.get('vehicleType');
        
                    if (!plate || !vehicleType) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Los campos Placa y Tipo de Vehículo son obligatorios.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
        
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/registerPlate.php',  
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            if (response.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Vehículo registrado',
                                    text: 'El vehículo ha sido registrado exitosamente.',
                                    confirmButtonColor: '#053684',
                                    showClass: {
                                        popup: `
                                        animate__animated
                                        animate__fadeInUp
                                        animate__faster
                                        `
                                    },
                                    hideClass: {
                                        popup: `
                                        animate__animated
                                        animate__fadeOutDown
                                        animate__faster
                                        `
                                    },
                                    confirmButtonText: 'OK'
                                }).then(() => {
                                    $("#plate").val(plate); 
                                    Swal.close();  
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: response.message,
                                    confirmButtonColor: '#053684',
                                    confirmButtonText: 'OK'
                                });
                            }
                        },
                        error: function() {
                            console.error('Error al registrar el vehículo');
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un problema al registrar el vehículo. Intente nuevamente.',
                                confirmButtonColor: '#053684',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                });
            }
        });
    });

    //REGISTER DRIVER
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
                                <div class="flex items-center">
                                    <select id="idType" name="idType" class="border-gray-300 rounded-lg p-2 bg-gray-100">
                                        <option value="V">V</option>
                                        <option value="E">E</option>
                                    </select>
                                    <input type="text" id="idCard" name="idCard" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100 ml-2" placeholder="Ingrese la cédula" required>
                                </div>
                            </div>
                            <div>
                                <label for="licenseType" class="block text-sm font-medium text-gray-700">Tipo de Licencia</label>
                                <select name="licenseType" id="licenseType" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" required>
                                    <option value="">Seleccione un tipo</option>
                                    <option value="1ra">1ra</option>
                                    <option value="2da">2da</option>
                                    <option value="3ra">3ra</option>
                                    <option value="4ta">4ta</option>
                                    <option value="5ta">5ta</option>
                                </select>
                            </div>
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input type="tel" id="phone" name="phone" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Número de teléfono">
                            </div>
                            <div>
                                <label for="address" class="block text-sm font-medium text-gray-700">Dirección</label>
                                <input type="text" id="address" name="address" class="border-gray-300 rounded-lg p-2 w-full bg-gray-100" placeholder="Ingrese la dirección">
                            </div>
                            <input type="hidden" id="driver" name="driver"> <!-- Campo oculto para cédula completa -->
                        </div>
                        <div class="text-center mt-4">
                            <button type="submit" id="register-driver" class="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Registrar</button>
                        </div>
                    </form>
                </div>`,
            width: 800,
            showConfirmButton: false,
            allowOutsideClick: false,
            showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
              },
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });
    
                $("#idCard").on("input", function() {
                    this.value = this.value.replace(/[^0-9]/g, '');
                });
    
                $("#newDriverForm").on("submit", function(e) {
                    e.preventDefault(); 
                    const form = document.getElementById('newDriverForm');
                    const formData = new FormData(form);
                    
                    const driverName = formData.get('driverName').trim();
                    const idType = formData.get('idType'); 
                    const idCard = formData.get('idCard').trim();
                    const licenseType = formData.get('licenseType');
    
                    if (!driverName || !idCard || !licenseType) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Los campos Nombre del Conductor, Cédula y Tipo de Licencia son obligatorios.',
                            confirmButtonColor: '#053684',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
    
                    const fullIdCard = `${idType}${idCard}`;
                    formData.set('idCard', fullIdCard); 
    
                    $.ajax({
                        url: wb_subdir + '/php/vehiculos/registerDriver.php',  
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            if (response.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Conductor registrado',
                                    text: 'El conductor ha sido registrado exitosamente.',
                                    confirmButtonColor: '#053684',
                                    confirmButtonText: 'OK'
                                }).then(() => {
                                    $("#driver").val(fullIdCard);
                                    Swal.close();  
                                });
                            } else {
                                if (response.message.includes("Ya existe un conductor con el mismo nombre o cédula")) {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Datos Duplicados',
                                        text: response.message,
                                        confirmButtonColor: '#053684',
                                        confirmButtonText: 'Entendido'
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: response.message,
                                        confirmButtonColor: '#053684',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            }
                        },
                        error: function() {
                            console.error('Error al registrar el conductor');
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                showClass: {
                                    popup: `
                                      animate__animated
                                      animate__fadeInUp
                                      animate__faster
                                    `
                                  },
                                  hideClass: {
                                    popup: `
                                      animate__animated
                                      animate__fadeOutDown
                                      animate__faster
                                    `
                                  },
                                text: 'Hubo un problema al registrar el conductor. Intente nuevamente.',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                });
            }
        });
    });
    
    //VIEW DRIVERS DATA
    $('#viewDrivers').on('click', function() {
        Swal.fire({
            title: 'Conductores Registrados',
            html:
                `<div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <div id="modal-drivers-table" class="min-w-full"></div>
                </div>`,
            width: '80%', 
            showConfirmButton: false,
            allowOutsideClick: false,
            showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
              },
            backdrop: true,
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/drivers.php',
                    method: 'POST',
                    dataType: 'JSON',
                    success: function(response) {
                        const drivers = response.data;
                        const driverData = drivers.map(driver => [
                            driver.nombre,
                            driver.ci_rif,
                            driver.grlic
                        ]);
    
                        if (window.driverTable) {
                            window.driverTable.destroy();
                        }
    
                        window.driverTable = new simpleDatatables.DataTable("#modal-drivers-table", {
                            data: {
                                headings: ["Nombre", "Cédula", "Licencia"],
                                data: driverData
                            },
                            perPage: 10,
                            perPageSelect: [10, 20]
                        });
    
                        $('#modal-drivers-table').on('click', 'tbody tr', function() {
                            const selectedDriver = $(this).children('td').map(function() {
                                return $(this).text();
                            }).get();
    
                            $('#driver').val(selectedDriver[1]);
    
                            Swal.fire({
                                icon: 'success',
                                title: 'Conductor agregado',
                                text: `El conductor ${selectedDriver[0]} ha sido agregado correctamente.`,
                                timer: 2000,
                                confirmButtonColor: '#053684',
                                showConfirmButton: false
                            }).then(() => {
                                Swal.close();
                            });
                        });
                    }
                });
            }
        });
    });    
    
    $('#viewPlates').on('click', function() {
        Swal.fire({
            title: 'Placas registradas',
            html:
                `<div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <div id="modal-plates-table" class="min-w-full"></div>
                </div>`,
            width: '80%', 
            showConfirmButton: false,
            allowOutsideClick: false,
            showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
              },
            backdrop: true,
            didOpen: () => {
                $("#close-modal").on("click", function() {
                    Swal.close();
                });
    
                $.ajax({
                    url: wb_subdir + '/php/vehiculos/plates.php',
                    method: 'POST',
                    dataType: 'JSON',
                    success: function(response) {
                        const plate = response.data;
                        const plateData = plate.map(plate => [
                            plate.placa,
                            plate.tipo,
                            //plate.peso
                        ]);
    
                        if (window.platesTable) {
                            window.platesTable.destroy();
                        }
    
                        window.platesTable = new simpleDatatables.DataTable("#modal-plates-table", {
                            data: {
                                headings: ["Placa", "Tipo"],
                                data: plateData
                            },
                            perPage: 10,
                            perPageSelect: [10, 20]
                        });
    
                        $('#modal-plates-table').on('click', 'tbody tr', function() {
                            const selectedPlate = $(this).children('td').map(function() {
                                return $(this).text();
                            }).get();

                            $('#plate').val(selectedPlate[0]);
                            $('#plateType').val(selectedPlate[1]);
    
                            Swal.fire({
                                icon: 'success',
                                title: 'Placa agregada',
                                text: `La placa ${selectedPlate[0]} ha sido agregado correctamente.`,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                Swal.close();
                            });
                        });
                    }
                });
            }
        });
    });    
    
    
    const today = new Date().toISOString().split('T')[0];
    $("#fecha-form").val(today);
    $("#fecha-table").val(today);
});
