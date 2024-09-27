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

  </head>
  <?php
    //SPINNER
    require __DIR__. '/../stuff/spinner.php'; 
  ?>

<!-- NAVBAR -->
  <body class="bg-gray-50 dark:bg-gray-800">
    <?php require __DIR__. '/../widgets/navbar.php'; ?>
<div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
<!-- ASIDE -->
  <?php require __DIR__. '/../widgets/aside.php'; ?>

<div class="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90" id="sidebarBackdrop"></div>
  
  <div id="main-content" class="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
    <main>
    <div class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
    <div class="mb-4 col-span-full xl:mb-2">
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
    </div>

<div class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
            <div class="mb-4 col-span-full xl:mb-2">
                <nav class="flex mb-5" aria-label="Breadcrumb">
                </nav>
            </div>
            
            <div class="col-span-full">
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Inventario</h2>
                <div class="mt-4">
                    <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                            <tr class="bg-gray-100 dark:bg-gray-700 text-gray-600 uppercase text-xs leading-normal">
                                <th class="py-3 px-6 text-left">Producto</th>
                                <th class="py-3 px-6 text-left">Cantidad</th>
                                <th class="py-3 px-6 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="inventoryTable">
                            <tr class="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td class="py-3 px-6">Producto 1</td>
                                <td class="py-3 px-6">10</td>
                                <td class="py-3 px-6">
                                    <button class="text-blue-500" data-modal-toggle="modal-edit">Editar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- MODAL -->
        <div id="modal-edit" class="fixed inset-0 z-50 hidden bg-gray-900/50 dark:bg-gray-900/90">
            <div class="flex items-center justify-center h-full">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Editar Producto</h3>
                    <div class="mt-4">
                        <label for="product-name" class="block text-sm">Nombre del Producto:</label>
                        <input type="text" id="product-name" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Nombre del Producto">
                        <label for="product-quantity" class="block text-sm mt-4">Cantidad:</label>
                        <input type="number" id="product-quantity" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Cantidad">
                    </div>
                    <div class="mt-6 flex justify-end">
                        <button class="bg-blue-500 text-white rounded-md px-4 py-2" id="save-btn">Guardar</button>
                        <button class="ml-2 text-gray-500" data-modal-toggle="modal-edit">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <p class="my-10 text-sm text-center text-gray-500">
            &copy; <?php echo date('Y'); ?> <a href="/<?php echo $wb_subdir?>/" class="hover:underline" target="_blank">Serviaves C.A</a>. Todos los derechos reservados.
        </p>
    </main>   
  </div>
</div>

<script>
    jQuery(document).ready(function($) {
        $('#search').on('input', function() {
            const query = $(this).val().toLowerCase();
            $('#inventoryTable tr').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
            });
        });
        
        $('[data-modal-toggle]').on('click', function() {
            const modal = $($(this).data('modal-toggle'));
            modal.toggleClass('hidden');
        });
    });
</script>

<?php
  require_js('flowbite-stuff/buttons.js');
  require_js('flowbite-stuff/app.bundle.js');
  require_js('flowbite-stuff/datepicker.min.js'); 
?>
  </body>
</html>