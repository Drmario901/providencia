<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

if (isset($_POST['plate'], $_POST['vehicleType'], $_POST['capacity'])) {
    $plate = mysqli_real_escape_string($conexion, $_POST['plate']);
    $vehicleType = mysqli_real_escape_string($conexion, $_POST['vehicleType']);
    $capacity = mysqli_real_escape_string($conexion, $_POST['capacity']);
    $taraWeight = mysqli_real_escape_string($conexion, $_POST['taraWeight']);
    $cubicMeters = mysqli_real_escape_string($conexion, $_POST['cubicMeters']);
    $insuranceExpiry = mysqli_real_escape_string($conexion, $_POST['insuranceExpiry']);
    $permitExpiry = mysqli_real_escape_string($conexion, $_POST['permitExpiry']);
    $comments = mysqli_real_escape_string($conexion, $_POST['comments']);

    $query = "INSERT INTO dpvehiculos (VEH_PLACA, VEH_TIPO, VEH_PESO, VEH_PESTAR, VEH_VOLUME, VEH_V_SEG, VEH_V_PER, VEH_COMENT) 
              VALUES ('$plate', '$vehicleType', '$capacity', '$taraWeight', '$cubicMeters', '$insuranceExpiry', '$permitExpiry', '$comments')";
    
    if (mysqli_query($conexion, $query)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al insertar el conductor: " . mysqli_error($conexion)]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
}

mysqli_close($conexion);
?>
