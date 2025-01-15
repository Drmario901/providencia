<?php

 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

if (isset($_POST['driverName'], $_POST['idCard'], $_POST['licenseType'])) {
    $driverName = mysqli_real_escape_string($conexion, $_POST['driverName']);
    $idCard = mysqli_real_escape_string($conexion, $_POST['idCard']);
    $licenseType = mysqli_real_escape_string($conexion, $_POST['licenseType']);
    $phone = isset($_POST['phone']) ? mysqli_real_escape_string($conexion, $_POST['phone']) : '';
    $address = isset($_POST['address']) ? mysqli_real_escape_string($conexion, $_POST['address']) : '';

    $checkQuery = "SELECT * FROM dpconductores WHERE CDT_CI_RIF = '$idCard' OR CDT_NOMBRE = '$driverName'";
    $result = mysqli_query($conexion, $checkQuery);

    if (mysqli_num_rows($result) > 0) {
        echo json_encode(["success" => false, "message" => "Ya existe un conductor con el mismo nombre o cédula."]);
    } else {
        $query = "INSERT INTO dpconductores (CDT_NOMBRE, CDT_CI_RIF, CDT_GRLIC, CDT_TEL1, CDT_DIR1, CDT_ACTIVO) 
                  VALUES ('$driverName', '$idCard', '$licenseType', '$phone', '$address', '1')";
        
        if (mysqli_query($conexion, $query)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al insertar el conductor: " . mysqli_error($conexion)]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
}

mysqli_close($conexion);
?>
