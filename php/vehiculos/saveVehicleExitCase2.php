<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);
date_default_timezone_set('America/Caracas'); 

$vehiculoId = $_POST['vehiculoId'];
$pesoBruto = $_POST['pesoBruto'];
$exitHour = date('H:i:s');

$querySalida = "UPDATE vehiculos SET estatus = 'Finalizado', peso_tara = '$pesoBruto', peso_neto = '$pesoBruto', hora_salida = '$exitHour' WHERE id = '$vehiculoId'";

if (mysqli_query($conexion, $querySalida)) {
    echo json_encode(['status' => 'finalizado']);
} else {
    echo json_encode(['error' => 'No se pudo registrar la salida']);
}

mysqli_close($conexion);
?>
