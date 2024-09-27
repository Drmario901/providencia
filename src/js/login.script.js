function mostrarPass() {
    const passwordInput = $('#contrasena');
    const passwordToggle = $('#password-toggle');

    const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
    passwordInput.attr('type', type);
    passwordToggle.find('svg').toggleClass('hidden');
}

jQuery(document).ready(function($) {
    const passwordInput = $('#contrasena');
    const alert = $('#login-alert');

    $('#login-form').on('submit', function(e) {
        e.preventDefault();

        const usuario = $.trim($('#usuario').val());
        const contrasena = $.trim($('#contrasena').val());

        if (usuario && contrasena) {
            Swal.fire({
                title: 'Accediendo',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            $.ajax({
                url: wb_subdir + '/php/login.php',
                method: 'POST',
                data: { data: { usuario: usuario, contrasena: contrasena } }
            })
            .done(function(response) {
                response = JSON.parse(response);
                // console.log(contrasena);
                // console.log(response);

                if (response.err_msg) {
                    Swal.fire({
                        icon: 'error',
                        confirmButtonColor: '#053684',
                        title: 'Error',
                        text: response.err_msg,
                    });
                } else {
                    location.href = wb_subdir;
                }
            })
            .fail(function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión. Inténtalo de nuevo más tarde.',
                });
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Debes completar ambos campos',
            });
        }
    });

    passwordInput.on('keypress', function(e) {
        if (e.which === 13) {
            $('#login-form').submit();
        }
    });
});
