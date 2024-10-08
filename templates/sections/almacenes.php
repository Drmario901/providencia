<?php
    require __DIR__.'/../../php/global.php';
    require __DIR__.'/../../php/conexion.php';
    acceso_requerido([$nivel_acceso_admin]);
?>

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Serviaves - Almacenes</title>
    <?php
        require_lib_js('tailwind/tailwind.js');
        require_lib_js('sweetalert2/sweetalert2.all.min.js');
        require_lib_css('sweetalert2/sweetalert2.min.css');
        require_lib_js('jquery/jquery.min.js');
        require_js('global.js');
        echo $favicon;
        echo $disable; 
    ?> 
    <link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  </head>
  
  <body class="bg-gray-100">
    <?php require __DIR__. '/../widgets/navbar.php'; ?>
    <div class="flex pt-16 overflow-hidden">
        <?php require __DIR__. '/../widgets/aside.php'; ?>
        
        <div id="main-content" class="relative w-full h-full p-6 bg-white shadow-md rounded-lg dark:bg-gray-900 lg:ml-64">
            <main>
                <nav class="flex mb-5" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
              <li class="inline-flex items-center">
                <a href="#" class="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  <svg class="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                  Inventario
                </a>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                  <a href="#" class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-primary-500">Almacenes</a>
                </div>
              </li>
            </ol>
        </nav>
                <div class="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-800">
                    <table id="default-table" class="min-w-full bg-white dark:bg-gray-800">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <!-- <th class="px-4 py-2">TABLE HEADINGS</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <!-- CONTENT -->
                        </tbody>
                    </table>
                </div>

                <footer class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; <?php echo date('Y'); ?> <a href="/<?php echo $wb_subdir?>/" class="hover:underline" target="_blank">Serviaves C.A</a>. Todos los derechos reservados.
                </footer>
            </main>   
        </div>
    </div>

    <!-- Main modal -->
<div id="crud-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Product
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form class="p-4 md:p-5">
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                        <input type="number" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select category</option>
                            <option value="TV">TV/Monitors</option>
                            <option value="PC">PC</option>
                            <option value="GA">Gaming/Console</option>
                            <option value="PH">Phones</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                        <textarea id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write product description here"></textarea>                    
                    </div>
                </div>
                <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Add new product
                </button>
            </form>
        </div>
    </div>
</div> 


    <?php
        require_js('flowbite-stuff/buttons.js');
        require_js('flowbite-stuff/app.bundle.js');
        require_js('flowbite-stuff/datepicker.min.js'); 
    ?>

    <script>
        jQuery(document).ready(function($) {
            let dataTable;

            function initializeDataTable(data) {
                if (dataTable) {
                    dataTable.destroy();
                }

                dataTable = new simpleDatatables.DataTable("#default-table", {
                    data: {
                        headings: ["Almacén", "Tipo", "Descripción", "Código", "Und. Medida", "Cantidad", "Acciones"],
                        data: data
                    }
                });

                $("#default-table").on('click', '.action-button', function() {
                    const rowData = $(this).data('row');

                    Swal.fire({
                        title: `Acciones para ${rowData.descripcion}`,
                        text: `Código: ${rowData.codigo}\nCantidad: ${rowData.cantidad}`,
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar'
                    });
                });
            }

            $.ajax({
                url: wb_subdir + '/php/inventario/inventario.php',
                type: "POST",
                dataType: "JSON",
                success: function(data) {
                    const formattedData = data.map(item => [
                        item.almacen || '',           
                        item.tipomateria || '',
                        item.descripcion || '',           
                        item.codigo || '',    
                        item.unidadmedida || '',
                        item.cantidad || '',               
                        `<button data-modal-target="crud-modal" data-modal-toggle="crud-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" data-row='${JSON.stringify({
                            almacen: item.almacen,
                            tipo: item.tipomateria,
                            descripcion: item.descripcion,
                            codigo: item.codigo,
                            unidadmedida: item.unidadmedida,
                            cantidad: item.cantidad
                        })}'>Ver Acciones</button>`
                    ]);

                    initializeDataTable(formattedData);
                },
                error: function(xhr, status, error) {
                    console.error("Error al obtener los datos: " + error);
                }
            });
        });
    </script>
  </body>
</html>