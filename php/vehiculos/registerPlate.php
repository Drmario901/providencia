<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
if (!mysqli_select_db($conexion, $bd)) {
    echo json_encode(["success" => false, "message" => "Error seleccionando la base de datos: " . mysqli_error($conexion)]);
    exit;
}

if (isset($_POST['plate'], $_POST['vehicleType'], $_POST['capacity'])) {
    $plate = mysqli_real_escape_string($conexion, $_POST['plate']);
    $vehicleType = mysqli_real_escape_string($conexion, $_POST['vehicleType']);
    $capacity = isset($_POST['capacity']) && $_POST['capacity'] !== '' ? mysqli_real_escape_string($conexion, $_POST['capacity']) : '0';
    $taraWeight = isset($_POST['taraWeight']) && $_POST['taraWeight'] !== '' ? mysqli_real_escape_string($conexion, $_POST['taraWeight']) : '0';
    $cubicMeters = isset($_POST['cubicMeters']) && $_POST['cubicMeters'] !== '' ? mysqli_real_escape_string($conexion, $_POST['cubicMeters']) : '0';
    $insuranceExpiry = isset($_POST['insuranceExpiry']) && $_POST['insuranceExpiry'] !== '' ? mysqli_real_escape_string($conexion, $_POST['insuranceExpiry']) : NULL;
    $permitExpiry = isset($_POST['permitExpiry']) && $_POST['permitExpiry'] !== '' ? mysqli_real_escape_string($conexion, $_POST['permitExpiry']) : NULL;
    $comments = isset($_POST['comments']) ? mysqli_real_escape_string($conexion, $_POST['comments']) : '';

    $checkQuery = "SELECT * FROM dpvehiculos WHERE VEH_PLACA = '$plate'";
    $result = mysqli_query($conexion, $checkQuery);

    if (!$result) {
        echo json_encode(["success" => false, "message" => "Error en la consulta de verificación: " . mysqli_error($conexion)]);
        exit;
    }

    if (mysqli_num_rows($result) > 0) {
        echo json_encode(["success" => false, "message" => "La placa ya está registrada."]);
    } else {
        $query = "INSERT INTO dpvehiculos (VEH_PLACA, VEH_TIPO, VEH_PESO, VEH_PESTAR, VEH_VOLUME, VEH_V_SEG, VEH_V_PER, VEH_COMENT) 
                  VALUES ('$plate', '$vehicleType', '$capacity', '$taraWeight', '$cubicMeters', " . 
                  ($insuranceExpiry ? "'$insuranceExpiry'" : "NULL") . ", " . 
                  ($permitExpiry ? "'$permitExpiry'" : "NULL") . ", '$comments')";

        if (mysqli_query($conexion, $query)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al insertar el vehículo: " . mysqli_error($conexion)]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
}

mysqli_close($conexion);
?>
