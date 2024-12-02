<?php
    require __DIR__.'/../../php/global.php';
    require __DIR__.'/../../php/conexion.php';
    acceso_requerido([$nivel_acceso_admin]);
?>

<!doctype html>
<html lang="es" class="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vehículos - Entrada y Salida</title>
    <?php
        require_lib_js('tailwind/tailwind.js');
        require_lib_js('sweetalert2/sweetalert2.all.min.js');
        require_lib_css('sweetalert2/sweetalert2.min.css');
        require_lib_css('simple-datatables/style.css');
        require_lib_css('animate-css/animate-css.css');
        require_lib_js('jquery/jquery.min.js');
        require_lib_js('simple-datatables/simple-datatables.js');
        require_lib_js('select2/select2.min.js');
        require_lib_css('select2/select2.min.css');
        require_lib_js('html2pdfjs/html2pdf.js');
        require_lib_js('pdfjs/pdfjs.js');
        require_js('global.js');
        require_js('vehiculos/entrada.js');
        require_js('vehiculos/tableEntry.js');
        require_js('vehiculos/generate.romana.ticket.js');
        require_js('vehiculos/notas/generate.notes.js');
        echo $favicon;
        echo $disable; 
    ?>
    <style>
      .table-container {
        overflow-x: auto;
        max-width: 100%;
      }
      table {
        width: 100%;
        min-width: 1000px;
      }
      @media (max-width: 1024px) {
        .responsive-table {
          font-size: 14px;
        }
        .responsive-table th,
        .responsive-table td {
          padding: 0.75rem;
        }
      }
      @media (max-width: 640px) {
        .responsive-table {
          font-size: 12px;
        }
        .responsive-table th,
        .responsive-table td {
          padding: 0.5rem;
        }
      }
    table#default-table th, 
    table#default-table td {
        padding: 0.3rem; 
        font-size: 0.75rem; 
    }

    table#default-table {
        border-collapse: collapse; 
    }

    table#default-table th {
        white-space: nowrap;
    }

    table#default-table td {
        white-space: normal; 
        text-overflow: ellipsis; 
        overflow: hidden;
    }

    table#default-table td.codigo-producto, 
    table#default-table td.producto-ingresado {
        max-width: 250px; 
        word-wrap: break-word; 
    }

    div.overflow-x-auto {
        max-width: 100%; 
    }

    table#default-table td {
        cursor: pointer; 
        transition: background-color 0.2s ease; 
    }

    table#default-table td:hover {
        background-color: #f0f8ff; 
    }

    table#default-table td:active {
        background-color: #f0f8ff; 
    }

    </style>
  </head>
  
  <body class="bg-gray-100 dark:bg-gray-900">
    <?php require __DIR__. '/../widgets/navbar.php'; ?>
    <div class="flex flex-col lg:flex-row pt-16 overflow-hidden">
        <?php require __DIR__. '/../widgets/aside.php'; ?>
        <?php require 'notesModal.php'; ?>
        
        <div id="main-content" class="relative w-full h-full p-4 lg:p-6 bg-white shadow-md rounded-lg dark:bg-gray-800 lg:ml-64">
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
                          <a href="#" class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-primary-500">Entrada y Salida</a>
                        </div>
                      </li>
                    </ol>
                </nav>
                <div class="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-800">
                    <div class="container mx-auto px-4 py-8">
                        <!-- <header class="text-center mb-8">
                            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">Registro de Entrada y Salida de Vehículos</h1>
                        </header> -->

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 lg:p-6 rounded-lg shadow mb-8">
                            <form id="entryForm" class="space-y-6">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="relative">
                                        <label for="plate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placa</label>
                                        <div class="flex">
                                            <input type="text" name="plate" id="plate" placeholder="Placa" class="rounded-l-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required readonly>
                                            <button data-tooltip-target="tooltip-plate" type="button" class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 border border-l-0 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700" aria-label="Buscar por placa" id="viewPlates">
                                                <i data-lucide="search" class="w-5 h-5"></i>
                                            </button>
                                            <button data-tooltip-target="tooltip-registerPlate" type="button" class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700" aria-label="Registrar placa" id="registerPlate">
                                                <i data-lucide="notebook-pen" class="w-5 h-5"></i>
                                            </button>
                                            <input type="text" id="plateType" hidden>
                                        </div>
                                        <div id="tooltip-plate" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                            Buscar Placa
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                        <div id="tooltip-registerPlate" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                            Registrar Placa
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                    </div>
                                    <div class="relative">
                                        <label for="driver" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conductor</label>
                                        <div class="flex">
                                            <input type="text" name="driver" id="driver" placeholder="Conductor" class="rounded-l-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required readonly>
                                            <button data-tooltip-target="tooltip-driver" type="button" class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 border border-l-0 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700" aria-label="Buscar por conductor" id="viewDrivers">
                                                <i data-lucide="user-search" class="w-5 h-5"></i>
                                            </button>
                                            <button data-tooltip-target="tooltip-driver-register" type="button" class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700" aria-label="Registrar conductor" id="registerDriver">
                                                <i data-lucide="user-round-pen" class="w-5 h-5"></i>
                                            </button>
                                            <input type="text" name="driverName" id="driverName" placeholder="Conductor" class="hidden rounded-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        </div>
                                        <div id="tooltip-driver" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                            Buscar Conductor
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                        <div id="tooltip-driver-register" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                                            Registrar Conductor
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="relative">
                                        <label for="entryDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                                        <div class="flex items-center">
                                            <input type="date" name="fecha-form" id="fecha-form" class="rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <input id="product-entry" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                            <label for="product-entry" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ingreso de producto</label>
                                        </div>
                                        <div class="flex items-center">
                                <input id="multiple-products" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                            <label for="multiple-products" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Múltiples productos</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input id="no-product-entry" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                            <label for="no-product-entry" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ingreso sin  producto</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label for="product" id="productLabel" class="hidden block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto</label>
                                    <select name="product" id="productSelect" class="hidden w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    </select>
                                    <label for="multipleProductSelect" id="multipleProductLabel" class="hidden block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seleccione productos</label>
                                    <select name="multipleProductSelect" id="multipleProductSelect" multiple="multiple" class="hidden w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    </select>
                                </div>
                                <div class="relative">
                                    <label for="entryWeight" class="hidden block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso de Entrada</label>
                                    <div class="flex">
                                        <input type="text" name="entryWeight" id="entryWeight" class="hidden rounded-l-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <button id="readWeight" type="button" class="hidden inline-flex items-center px-3 text-sm font-medium text-white bg-blue-900 rounded-r-md border border-l-0 border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Leer peso
                                        </button>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" id="registerForm" class="hidden inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Registrar
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow">
                            <div class="mb-4 flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
                                <div class="flex-grow">
                                    <label for="tableDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seleccionar fecha:</label>
                                    <input type="date" id="fecha-table" name="tableDate" class="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div class="flex-grow">
                                    <label for="period" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periodo:</label>
                                    <select id="period" class="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="" disabled selected>Seleccionar periodo</option>
                                        <option value="diario">Diario</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="quincenal">Quincenal</option>
                                        <option value="mensual">Mensual</option>
                                        <option value="bimestral">Bimestral</option>
                                        <option value="trimestral">Trimestral</option>
                                        <option value="semestral">Semestral</option>
                                        <option value="anual">Anual</option>
                                        <option value="indicada">Indicada</option>
                                    </select>
                                </div>
                                <div class="flex-grow">
                                    <label for="dateRange" id="dateRange" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rango de fechas:</label>
                                    <div class="flex space-x-2">
                                        <input 
                                            type="date" 
                                            id="startDate" 
                                            name="startDate" 
                                            class="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                        <input 
                                            type="date" 
                                            id="endDate" 
                                            name="endDate" 
                                            class="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                    </div>
                                </div>
                                <div class="flex-shrink-0">
                                    <button type="button" id="reprintTicket" class="w-full lg:w-auto inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <i data-lucide="ticket" class="w-5 h-5 mr-2"></i>
                                        Reimprimir ticket
                                    </button>
                                </div>
                                <!-- <div class="flex-shrink-0">
                                    <button data-modal-target="pdfModal" data-modal-toggle="pdfModal" type="button" class="w-full lg:w-auto inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <i data-lucide="clipboard-check" class="w-5 h-5 mr-2"></i>
                                        Notas
                                    </button>
                                </div> -->
                                <div class="flex-shrink-0">
                                    <label class="inline-flex items-center cursor-pointer">
                                        <input id="print" checked type="checkbox" value="" class="sr-only peer">
                                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-900 peer-checked:bg-blue-900"></div>
                                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Imprimir tickets</span>
                                    </label>
                                </div>
                            </div>
                            <div class="overflow-x-auto">
                                <table id="default-table" class="w-full text-xs responsive-table">
                                    <thead class="bg-gray-50 dark:bg-gray-700">
                                        <!-- HEADINGS -->
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