<!-- <div id="pdfModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full animate__animated">
        <div class="relative w-full max-w-7xl max-h-full">
            <div class="relative bg-white rounded-lg shadow">
                <div class="flex items-start justify-between p-4 border-b rounded-t">
                    <h3 class="text-xl font-semibold text-gray-900">
                        Generar un tipo de nota
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="pdfModal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Cerrar modal</span>
                    </button>
                </div>

                <div class="p-6 space-y-6">
                    <div style="display: flex; height: 600px;">
                        <div style="width: 25%; padding-right: 1rem; border-right: 1px solid #e5e7eb; overflow-y: auto;">
                            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Seleccione un tipo de documento:</h3>
                            <ul id="pdfList" style="list-style-type: none; padding: 0;">
                                <li style="margin-bottom: 0.5rem;">
                                    <button class="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                                        Recepción de Materia Prima
                                    </button>
                                </li>
                                <li style="margin-bottom: 0.5rem;">
                                    <button class="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                                        Despacho de Materia Prima
                                    </button>
                                </li>
                                <li style="margin-bottom: 0.5rem;">
                                    <button class="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                                        Despacho de Producto Terminado
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div style="width: 75%; padding-left: 1rem; overflow-y: auto;">
                            <div class="mb-4">
                                <label for="fecha" class="block text-sm font-medium text-gray-700">Seleccionar Fecha:</label>
                                <input type="date" id="fecha-modal" class="w-full mt-1 p-2 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>

                            <div class="mb-4">
                                <label for="selectSalidas" class="block text-sm font-medium text-gray-700">Seleccionar una salida:</label>
                                <select id="selectSalidas" class="w-full mt-1 p-2 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" selected disabled>Seleccione una salida</option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label for="selectProveedor" class="block text-sm font-medium text-gray-700">Seleccionar Proveedor:</label>
                                <select id="selectProveedor" class="w-full mt-1 p-2 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" selected disabled>Seleccione un proveedor</option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label for="numeroSica" class="block text-sm font-medium text-gray-700">Numero de Sica:</label>
                                <input type="number" id="numeroSica" class="w-full mt-1 p-2 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el numero de sica">
                            </div>

                            <div class="mb-4">
                                <label for="pesoProveedor" class="block text-sm font-medium text-gray-700">Peso Neto del Proveedor:</label>
                                <input type="number" id="pesoProveedor" class="w-full mt-1 p-2 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el peso neto dado por el proveedor">
                            </div>

                            <div class="text-right mb-4">
                                <button id="generarPDF" class="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Generar PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('pdfModal');
        const openModalButton = document.querySelector('[data-modal-show="pdfModal"]');
        const closeModalButton = modal.querySelector('[data-modal-hide="pdfModal"]');

        openModalButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('animate__fadeInDown'); 
        });

        closeModalButton.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('animate__fadeInDown'); 
        });
    });

    </script> -->