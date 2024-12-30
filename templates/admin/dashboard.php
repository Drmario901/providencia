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
    //require_lib_js('tailwind/tailwind.js');
    require_tailwind();
    require_lib_js('sweetalert2/sweetalert2.all.min.js');
    require_lib_css('sweetalert2/sweetalert2.min.css');
    require_lib_js('jquery/jquery.min.js');
    require_lib_js('chart.js/chart.js');
    require_js('global.js');
    echo $favicon;
    //echo $disable; 
?> 
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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

  <div id="main-content" class="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
    <main>
        <div class="px-4 pt-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="bg-white border border-gray-200 rounded-lg shadow p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h5 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Total Inventario</h5>
                    <p class="text-3xl font-extrabold text-gray-900 dark:text-white">$1,245,890</p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Actualizado hace 1 hora</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h5 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Vehículos Activos</h5>
                    <p class="text-3xl font-extrabold text-gray-900 dark:text-white">87</p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">+2 desde ayer</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h5 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Almacenes</h5>
                    <p class="text-3xl font-extrabold text-gray-900 dark:text-white">5</p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">En 3 ciudades</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h5 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Eficiencia</h5>
                    <p class="text-3xl font-extrabold text-gray-900 dark:text-white">92%</p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">+5% este mes</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Inventario por Almacén</h3>
                    </div>
                    <div class="p-4">
                        <div class="relative w-full" style="height: 400px;">
                            <canvas id="inventoryChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Estado de Vehículos</h3>
                        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5" type="button">
                            <span class="sr-only">Abrir menú</span>
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                            </svg>
                        </button>
                        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Exportar datos</a>
                                </li>
                                <li>
                                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Generar reporte</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="relative overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">ID Vehículo</th>
                                        <th scope="col" class="px-6 py-3">Tipo</th>
                                        <th scope="col" class="px-6 py-3">Estado</th>
                                        <th scope="col" class="px-6 py-3">Última Actualización</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">VH001</th>
                                        <td class="px-6 py-4">Camión</td>
                                        <td class="px-6 py-4">
                                            <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Activo</span>
                                        </td>
                                        <td class="px-6 py-4">Hace 2 horas</td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">VH002</th>
                                        <td class="px-6 py-4">Furgoneta</td>
                                        <td class="px-6 py-4">
                                            <span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">En mantenimiento</span>
                                        </td>
                                        <td class="px-6 py-4">Hace 1 día</td>
                                    </tr>
                                    <tr class="bg-white dark:bg-gray-800">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">VH003</th>
                                        <td class="px-6 py-4">Camión</td>
                                        <td class="px-6 py-4">
                                            <span class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Inactivo</span>
                                        </td>
                                        <td class="px-6 py-4">Hace 3 días</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg shadow p-4 dark:bg-gray-800 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat, nulla ut dapibus tincidunt, quam nibh finibus libero, eget vulputate urna tellus sed dui. Nulla fermentum arcu iaculis, vulputate leo at, molestie metus.</h3>
                <p class="text-gray-600 dark:text-gray-400">Pellentesque consequat vulputate tortor, at porttitor risus pellentesque vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque sagittis fringilla libero ut pharetra. Phasellus id pharetra justo. Sed ultrices sit amet nulla vel tincidunt. Vivamus tempor consequat dolor non scelerisque. Mauris congue imperdiet felis.</p>
            </div>
        </div>
        <?php
        //FOOTER
         require __DIR__. '/../widgets/footer.php'; 
        ?>
    </main>
</div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var ctx = document.getElementById('inventoryChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Almacén A', 'Almacén B', 'Almacén C', 'Almacén D', 'Almacén E'],
                    datasets: [{
                        label: 'Valor del inventario ($)',
                        data: [350000, 290000, 220000, 180000, 205000],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });
    </script>

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