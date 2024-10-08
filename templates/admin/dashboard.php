<?php
    require __DIR__.'/../../php/global.php';
    acceso_requerido([$nivel_acceso_admin]);
?>

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard - Serviaves</title>
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
    </div>

<div class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
            <div class="mb-4 col-span-full xl:mb-2">
                <nav class="flex mb-5" aria-label="Breadcrumb">
                </nav>
            </div>
        </div>

        
        <?php
        //FOOTER
         require __DIR__. '/../widgets/footer.php'; 
        ?>
    </main>   
  </div>
</div>

</div>

<?php
  require_js('flowbite-stuff/buttons.js');
  require_js('flowbite-stuff/app.bundle.js');
  require_js('flowbite-stuff/datepicker.min.js'); 
?>
  </body>
</html>