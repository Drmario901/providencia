domain = location.href.match(/^(https?:\/\/[^\/]+\/)/)[0]
let wb_subdir = `${domain}providencia`;

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
