<?php
    require_tailwind();
    global $wb_subdir;
?>
<div class="min-h-screen flex justify-center items-center bg-gray-200">
    <div class="w-11/12 max-w-md p-5 bg-white shadow-lg rounded-lg">
        <h1 class="text-xl font-bold">Acceso Denegado</h1>
        <h6 class="text-gray-600">No tienes permiso para acceder a este módulo</h6>
        <hr class="my-4 border-gray-300">
        <h6 class="font-semibold">Motivos:</h6>
        <p class="text-gray-700"><?php echo $exc_session_error ?></p>
        <a class="mt-4 inline-block px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded" href="<?php echo "/$wb_subdir/acceder" ?>">Volver</a>
    </div>
</div>
