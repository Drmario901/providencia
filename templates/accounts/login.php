<?php
    require __DIR__. '/../../php/global.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceder</title>
    <?php
        require_js('global.js');
        require_lib_js('tailwind/tailwind.js');
        require_lib_js('sweetalert2/sweetalert2.all.min.js');
        require_lib_css('sweetalert2/sweetalert2.min.css');
        require_lib_js('jquery/jquery.min.js');
        require_js('login.script.js');
        echo $favicon; 
    ?>
    <style>
        .btn-iniciar-sesion {
            background-color: #053684;
            transition: background-color 0.3s ease;
        }
        
        .btn-iniciar-sesion:hover {
            background-color: #0d5bbf; 
        }
    </style>
    
</head>
<body>
<div class="font-[sans-serif] bg-blue-900 md:h-screen">
    <div class="grid md:grid-cols-2 items-center gap-8 h-full">
        <div class="max-md:order-1 p-4">
            <img src="/<?php echo $wb_subdir?>/src/img/logoma.svg" class="lg:max-w-[80%] w-full h-full object-contain block mx-auto" alt="login-image" />
        </div>

        <div class="flex items-center md:p-8 p-6 bg-white md:rounded-tl-[55px] md:rounded-bl-[55px] h-full">
            <form id='login-form' class="max-w-lg w-full mx-auto">
            <div class="mb-12 text-center">
                <div class="flex items-center justify-center mb-4">
                <img src="/<?php echo $wb_subdir ?>/src/img/serviaves-text.png" alt="Serviaves" class="w-1/2" />
                </div>
            </div>
                <div>
                    <label class="text-gray-800 text-xs block mb-2">Nombre de usuario</label>
                    <div class="relative flex items-center">
                        <input name="usuario" id='usuario' type="text" required class="w-full text-sm border-b border-gray-300 focus:border-gray-800 px-2 py-3 outline-none" placeholder="Ingresa nombre de usuario" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                            <defs>
                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                </clipPath>
                            </defs>
                            <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                                <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                            </g>
                        </svg>
                    </div>
                </div>

                <div class="mt-8">
                    <label class="text-gray-800 text-xs block mb-2">Contraseña</label>
                    <div class="relative flex items-center">
                        <input name="contrasena" id="contrasena" type="password" required class="w-full text-sm border-b border-gray-300 focus:border-gray-800 px-2 py-3 outline-none" placeholder="Ingresar contraseña" />
                        <svg id="eye-icon" onclick="mostrarPass()" xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"></path>
                        </svg>
                    </div>
                </div>

                <div id="login-alert" class="text-red-500 mb-4" hidden></div>
                <button type="submit" class="btn-iniciar-sesion w-full py-3 px-6 text-sm font-semibold tracking-wider rounded-full text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition ease-in-out duration-300 mt-4">Iniciar sesión</button>
            </form>
        </div>
    </div>
</div>
</body>
</html>
