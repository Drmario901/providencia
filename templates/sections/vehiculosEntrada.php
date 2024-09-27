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
<title>Serviaves - Entrada de Vehículos</title>
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

  <div id="loading-spinner" class="flex flex-col items-center justify-center fixed inset-0 bg-white z-50">
  <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
  </svg>
  <span class="mt-2 text-gray-700">Cargando información</span>
</div>

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
                  Vehículos
                </a>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                  <a href="#" class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-primary-500">Entrada</a>
                </div>
              </li>
              <!-- <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                  <span class="ml-1 text-gray-400 md:ml-2 dark:text-gray-500" aria-current="page">Playground</span>
                </div>
              </li> -->
            </ol>
        </nav>
        <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Create something awesome here</h1>
    </div>
    <!-- Right Content -->
    <div class="col-span-full xl:col-auto">
        <div class="p-4 mb-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card header</h3>
            </div>
            <div class="h-32 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card body</h3>
            </div>
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card footer</h3>
            </div>
        </div>
        <div class="p-4 mb-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card header</h3>
            </div>
            <div class="h-32 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card body</h3>
            </div>
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card footer</h3>
            </div>
        </div>
    </div>
    <div class="col-span-2">
        <div class="p-4 mb-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card header</h3>
            </div>
            <div class="h-32 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card body</h3>
            </div>
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card footer</h3>
            </div>
        </div>
        <div class="p-4 mb-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card header</h3>
            </div>
            <div class="h-32 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card body</h3>
            </div>
            <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
                <h3>Card footer</h3>
            </div>
        </div>
    </div>
</div>
<div class="grid gap-4 px-4 mb-4 md:grid-cols-2 xl:grid-cols-4">
    <div class="p-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card header</h3>
        </div>
        <div class="h-16 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card body</h3>
        </div>
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card footer</h3>
        </div>
    </div>
    <div class="p-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card header</h3>
        </div>
        <div class="h-16 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card body</h3>
        </div>
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card footer</h3>
        </div>
    </div>
    <div class="p-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card header</h3>
        </div>
        <div class="h-16 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card body</h3>
        </div>
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card footer</h3>
        </div>
    </div>
    <div class="p-4 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card header</h3>
        </div>
        <div class="h-16 px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card body</h3>
        </div>
        <div class="px-4 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600">
            <h3>Card footer</h3>
        </div>
    </div>
</div>
    </main>

<p class="my-10 text-sm text-center text-gray-500">
    &copy; <?php echo date('Y'); ?> <a href="/<?php echo $wb_subdir?>/" class="hover:underline" target="_blank">Serviaves C.A</a>. Todos los derechos reservados.
</p>
   
  </div>

</div>



<?php
  require_js('flowbite-stuff/buttons.js');
  require_js('flowbite-stuff/app.bundle.js');
  require_js('flowbite-stuff/datepicker.min.js'); 
?>
  </body>
</html>