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
    <title>Vehículos - Entrada</title>
    <?php
        require_lib_js('tailwind/tailwind.js');
        require_lib_js('sweetalert2/sweetalert2.all.min.js');
        require_lib_css('sweetalert2/sweetalert2.min.css');
        require_lib_css('simple-datatables/style.css');
        require_lib_css('animate-css/animate-css.css');
        require_lib_js('jquery/jquery.min.js');
        require_lib_js('simple-datatables/simple-datatables.js');
        require_js('global.js');
        require_js('vehiculos/entrada.js');
        echo $favicon;
        echo $disable; 
    ?> 
    <style>
      .center-table {
        display: flex;
        justify-content: center;
        width: 100%;
        overflow-x: auto;
      }
    </style>
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
                          Vehículos
                        </a>
                      </li>
                      <li>
                        <div class="flex items-center">
                          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                          <a href="#" class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-primary-500">Entrada</a>
                        </div>
                      </li>
                    </ol>
                </nav>
                <div class="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-800">
                    <div class="container mx-auto px-4 py-8">
                        <header class="text-center mb-8">
                            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Registro de Entrada de Vehículos</h1>
                        </header>

                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
                                <form id="entryForm" class="space-y-4">
                                    <div class="relative">
                                        <label for="plate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placa</label>
                                        <div class="flex">
                                            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                <button data-tooltip-target="tooltip-truck" type="button" class="focus:outline-none hover:text-blue-500" aria-label="Registrar vehículo" id="registerPlate">
                                                    <i data-lucide="truck" class="w-5 h-5"></i>
                                                </button>
                                                <div id="tooltip-truck" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                                    Registrar Vehículo
                                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                                </div>
                                            </span>
                                            <input type="text" name="plate" id="plate" class="rounded-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                <button data-tooltip-target="tooltip-plate" type="button" class="focus:outline-none hover:text-blue-500" aria-label="Buscar por placa" id="">
                                                    <i data-lucide="book" class="w-5 h-5"></i>
                                                </button>
                                            </span>
                                            <div id="tooltip-plate" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                                Buscar Placa
                                                <div class="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="relative">
                                        <label for="driver" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conductor</label>
                                        <div class="flex">
                                            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                <button data-tooltip-target="tooltip-id" type="button" class="focus:outline-none hover:text-blue-500" aria-label="Registrar conductor" id="registerDriver">
                                                    <i data-lucide="id-card" class="w-5 h-5"></i>
                                                </button>
                                                <div id="tooltip-id" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                                    Registrar Conductor
                                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                                </div>
                                            </span>
                                            <input type="text" name="driver" id="driver" class="rounded-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                <button data-tooltip-target="tooltip-driver" type="button" class="focus:outline-none hover:text-blue-500" aria-label="Buscar por conductor" id="searchDriverBtn">
                                                    <i data-lucide="book" class="w-5 h-5"></i>
                                                </button>
                                            </span>
                                            <div id="tooltip-driver" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                                Buscar Conductor
                                                <div class="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="relative">
                                        <label for="entryDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                                        <div class="flex items-center">
                                            <input type="date" name="entryDate" id="entryDate" class="rounded-l-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                            <div class="ml-3 flex items-center">
                                                <input id="product-entry" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                                <label for="product-entry" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ingreso de producto</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="product" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto</label>
                                        <select name="product" id="product" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                            <option value="">Seleccione un producto</option>
                                            <option value="maiz">Maíz</option>
                                        </select>
                                    </div>
                                    <div class="relative">
                                        <label for="entryWeight" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso de Entrada</label>
                                        <div class="flex">
                                            <input type="number" name="entryWeight" id="entryWeight" step="0.01" class="rounded-l-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                            <button type="button" class="inline-flex items-center px-3 text-sm font-medium text-white bg-blue-900 rounded-r-md border border-l-0 border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                Leer peso
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Registrar
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow overflow-x-auto">
                                <div class="mb-4">
                                    <label for="tableDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seleccionar fecha:</label>
                                    <input type="date" id="tableDate" name="tableDate" class="mt-1 block w-full rounded-md  border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <table id="default-table" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    
                                    <thead class="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almacén</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Und. Medida</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                                        <!-- ELEMENTS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <footer class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; <?php echo date('Y'); ?> <a href="/<?php echo $wb_subdir?>/" class="hover:underline" target="_blank">Serviaves C.A</a>. Todos los derechos reservados.
                </footer>
            </main>   
        </div>
    </div>

    <?php
        require_js('flowbite-stuff/buttons.js');
        require_js('flowbite-stuff/app.bundle.js');
        require_js('flowbite-stuff/datepicker.min.js'); 
        require_lib_js('lucide/lucide.min.js');
    ?>
  </body>
</html>