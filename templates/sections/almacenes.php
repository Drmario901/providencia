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
        // require_lib_js('tailwind/tailwind.js');
        require_tailwind();
        require_lib_js('sweetalert2/sweetalert2.all.min.js');
        require_lib_css('sweetalert2/sweetalert2.min.css');
        require_lib_css('simple-datatables/style.css');
        require_lib_css('animate-css/animate-css.css');
        require_lib_js('jquery/jquery.min.js');
        require_lib_js('simple-datatables/simple-datatables.js');
        require_js('global.js');
        require_js('inventario/almacenes.js');
        echo $favicon;
        echo $disable; 
    ?> 

  </head>
  <?php
    //SPINNER
    require __DIR__. '/../stuff/spinner.php'; 
  ?>
  
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
    <div class="flex items-center mb-4">
        <!-- Input de Fecha -->
        <div class="mr-4">
            <label for="fecha-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
            <input type="date" id="fecha-input" class="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <!-- Select de Almacenes -->
        <div class="mr-4">
            <label for="almacen-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Almacén</label>
            <select id="almacen-select" class="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">Todos los Almacenes</option>
                <option value="201">201 - MATERIA PRIMA</option>
                <option value="202">202 - MATERIA PRIMA PROCESADA</option>
                <option value="203">203 - PRODUCTO TERMINADO</option>
                <option value="204">204 - MATERIAL DE EMPAQUE</option>
            </select>
        </div>
    </div>

    <!-- Tabla de Inventarios -->
    <table id="default-table" class="min-w-full bg-white dark:bg-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
                <th class="px-4 py-2">Almacén</th>
                <th class="px-4 py-2">Tipo</th>
                <th class="px-4 py-2">Código</th>
                <th class="px-4 py-2">Descripción</th>
                <th class="px-4 py-2">Und. Medida</th>
                <th class="px-4 py-2">Cantidad</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>

                <br>
                <footer class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; <?php echo date('Y'); ?> <a href="/<?php echo $wb_subdir?>/" class="hover:underline">Serviaves C.A</a>. Todos los derechos reservados.
                </footer>
            </main>   
        </div>
    </div>

    <?php
        require_js('flowbite-stuff/buttons.js');
        require_js('flowbite-stuff/app.bundle.js');
        require_js('flowbite-stuff/datepicker.min.js'); 
    ?>
  </body>
</html>