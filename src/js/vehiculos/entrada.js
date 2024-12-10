jQuery(document).ready(function($) {  

    //READ WEIGHT FUNCTION
    function readWeight() {
        $.ajax({
            url: 'http://localhost:8080/index', 
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
                            allowOutsideClick: false,
                            allowEscapeKey: false,
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
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
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
                                    $("#plateType").val(vehicleType);
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
                                allowOutsideClick: false,
                                allowEscapeKey: false,
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
            allowEscapeKey: false,
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
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
    
                    const fullIdCard = `${idType}${idCard}`;
                    const name = `${driverName}`;
                    const type = `${idType}`;
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
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: 'OK'
                                }).then(() => {
                                    $("#driver").val(fullIdCard);
                                    $("#driverName").val(name);
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
    $('#viewDrivers').on('click', function () {
        Swal.fire({
            title: 'Conductores Registrados',
            html: `
                <div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <div id="modal-drivers-table" class="min-w-full">
                        <div class="spinner-container">
                            <div class="spinner"></div>
                        </div>
                    </div>
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

                $("#close-modal").on("click", function () {
                    Swal.close();
                });

                $.ajax({
                    url: wb_subdir + '/php/vehiculos/drivers.php',
                    method: 'POST',
                    dataType: 'JSON',
                    success: function (response) {
                        const drivers = response.data
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
    
                        $('.spinner-container').remove();
                        $('#modal-drivers-table').on('click', 'tbody tr', function () {
                            const selectedDriver = $(this).children('td').map(function () {
                                return $(this).text();
                            }).get();
    
                            $('#driver').val(selectedDriver[1]);
                            $('#driverName').val(selectedDriver[0]);
    
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
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudieron cargar los datos de los conductores.',
                            confirmButtonColor: '#d33',
                            showConfirmButton: true
                        });
                    }
                });
            }
        });
    });    
    
    //VIEW PLATES
    $('#viewPlates').on('click', function () {
        Swal.fire({
            title: 'Placas registradas',
            html: `
                <div class="relative bg-white shadow-lg rounded-lg p-6">
                    <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        &times;
                    </button>
                    <div id="modal-plates-table" class="min-w-full">
                        <div class="spinner-container">
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>`,
            width: '80%',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
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
                // Estilos para el spinner
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
                    
                $("#close-modal").on("click", function () {
                    Swal.close();
                });

                $.ajax({
                    url: wb_subdir + '/php/vehiculos/plates.php',
                    method: 'POST',
                    dataType: 'JSON',
                    success: function (response) {
                        const plate = response.data;
                        const plateData = plate.map(plate => [
                            plate.placa,
                            plate.tipo
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

                        $('.spinner-container').remove();
                        $('#modal-plates-table').on('click', 'tbody tr', function () {
                            const selectedPlate = $(this).children('td').map(function () {
                                return $(this).text();
                            }).get();
    
                            $('#plate').val(selectedPlate[0]);
                            $('#plateType').val(selectedPlate[1]);
    
                            Swal.fire({
                                icon: 'success',
                                title: 'Placa agregada',
                                text: `La placa ${selectedPlate[0]} ha sido agregada correctamente.`,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                Swal.close();
                            });
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudieron cargar las placas registradas.',
                            confirmButtonColor: '#d33',
                            showConfirmButton: true
                        });
                    }
                });
            }
        });
    });

    let today = new Date();
    let formattedToday = today.toISOString().split('T')[0]; 

    $("#fecha-form").val(formattedToday);
    $("#fecha-form").attr('readonly', true);
    $("#fecha-table").val(formattedToday);
    $('#fecha-modal').val(formattedToday);
});
