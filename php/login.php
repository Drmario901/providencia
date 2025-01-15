<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require __DIR__.'/global.php';
require __DIR__.'/conexion.php';

$data = isset($_POST['data']) ? $_POST['data'] : false;

$resp = array();
$resp['err_msg'] = '';

if ($data) {
    $usuario = $data['usuario']; 
    $pass = $data['contrasena']; 

    $found = false;

    $query = "SELECT OPE_NUMERO, OPE_NOMBRE, OPE_CLAVE FROM dpusuarios";
    $result = $conexion->query($query);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $nombre = encript($row['OPE_NOMBRE'], false);
            $passUncrypted = encript($row['OPE_CLAVE'], false);

            if ($usuario == $nombre && $pass == $passUncrypted) {
                $found = true;
                $id_usuario = $row['OPE_NUMERO'];
                break;
            }
        }
    } else {
        $resp['err_msg'] = $conexion->error;
    }

    if ($found) {
        $_SESSION['CUENTA_ID'] = $id_usuario;
        $_SESSION['acceso'] = $nivel_acceso_admin;

        $twoDays = 2 * 24 * 60 * 60; 
        setcookie(
            'PHPSESSID',
            session_id(),
            time() + $twoDays,
            '/',
            '', 
            isset($_SERVER['HTTPS']), 
            true 
        );

        //$_SESSION['ipOrigen'] = getPublicIP();
        //$resp['success'] = 'OK';
    } else {
        $resp['err_msg'] = 'Usuario o contraseña incorrectos.';
    }
} else {
    $resp['err_msg'] = 'Error, reportar problema.';
}

echo json_encode($resp);
?>
