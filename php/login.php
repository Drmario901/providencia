<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
        
    require __DIR__.'/global.php';
    require __DIR__.'/conexion.php';

    $data = isset($_POST['data']) ? $_POST['data'] : false;

    $resp = array();
    $resp['err_msg'] = '';

    if ($data) {
        $usuario = $data['usuario'];
        $contrasenaHash = hash('sha256', $data['contrasena']); 

        $query = "SELECT id_usuario, contrasena, acceso FROM usuarios WHERE usuario = '$usuario'";
        $result = $conexion->query($query);
        
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();

            if ($row['contrasena'] == $contrasenaHash){ 

                $id_usuario = $row['id_usuario'];
                
                $_SESSION['CUENTA_ID'] = $id_usuario;
                $_SESSION['acceso'] = $row['acceso'];
                
                // registra en la base de datos

                registrar_accion('inicia sesion');
                $conexion->query("UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP() WHERE id_usuario = '$id_usuario'");

            }
            else {
                $resp['err_msg'] = 'Contraseña incorrecta';
            }
        }
        else {
            $resp['err_msg'] = 'El usuario no existe';
        }
    }
    else {
        $resp['err_msg'] = 'No se ha enviado ningún dato';
    }
    
    echo json_encode($resp);
?>
