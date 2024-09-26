<?php
include('global.php');
include('conexion.php'); 

$usuario = encript('DESARROLLADOR', true);
echo $usuario;
echo '<br>'; 
$pass = 12345;
$passEn = encript($pass, true);
echo $passEn; 
echo '<br>'; 

$query = "SELECT OPE_NOMBRE, OPE_CLAVE FROM dpusuarios WHERE OPE_NOMBRE = '$usuario'";
$result = $conexion->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    if ($row['OPE_CLAVE'] == $passEn) { 
        echo "OK.";
    } else {
        echo "NO";
        echo '<br>'; 
        echo "CLAVE EN DB: " . $row['OPE_CLAVE'];
    }
} else {
    echo "NADA";
}

?>
