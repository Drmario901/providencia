domain = location.href.match(/^(https?:\/\/[^\/]+\/)/)[0]
let wb_subdir = `${domain}providencia`;

//ASIDE  SUBMENU BEHAVIOR 
document.addEventListener('DOMContentLoaded', function () {
    const currentUrl = window.location.pathname;
    const menuToggles = document.querySelectorAll('.menu-toggle');

    menuToggles.forEach(function (toggle) {
        const target = toggle.getAttribute('data-target');
        const submenu = document.getElementById(target);
        
        if (submenu) {
            const links = submenu.querySelectorAll('.menu-link');

            links.forEach(function (link) {
                if (link.getAttribute('href') === currentUrl) {
                    submenu.classList.remove('hidden');
                    submenu.classList.add('block');

                    link.classList.add('bg-gray-100', 'dark:bg-gray-700');
                    toggle.classList.add('text-gray-900', 'dark:text-white');
                }
            });

            toggle.addEventListener('click', function () {
                if (submenu.classList.contains('hidden')) {
                    submenu.classList.remove('hidden');
                    submenu.classList.add('block');
                } else {
                    submenu.classList.add('hidden');
                    submenu.classList.remove('block');
                }
            });
        }
    });

    const allLinks = document.querySelectorAll('.menu-link');
    allLinks.forEach(function (link) {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('bg-gray-100', 'dark:bg-gray-700');
        }
    });
});

//SPINNER
      window.addEventListener('load', () => {
      document.getElementById('loading-spinner').style.display = 'none';
      document.getElementById('content').style.display = 'block';
    });

//btn-logout
jQuery(document).ready(function($) {
    $('#logout-btn').on('click', function() {
        let userId = $(this).data('id'); 
        
        Swal.fire({
            title: '¿Estás seguro de que quieres cerrar sesión?',
            text: "Se cerrará la sesión de este usuario.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#053684',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: wb_subdir + '/php/logout.php', 
                    type: 'POST',
                    data: { id: userId },
                    success: function(response) {
                        Swal.fire({
                            title: 'Sesión cerrada',
                            text: 'El usuario ha cerrado sesión exitosamente.',
                            icon: 'success', 
                            confirmButtonColor: '#053684'
                        }).then(() => {
                            window.location.replace(wb_subdir);
                        });
                    },
                    error: function() {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al cerrar la sesión.',
                            'error'
                        );
                    }
                });
            }
        });
    });
});
