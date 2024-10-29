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
$pesoActual = $_POST['pesoTara'];
$pesoNeto = $_POST['pesoNeto'];
$producto = $_POST['producto'];
$exitHour = date('H:i:s');

$queryPeso = "SELECT peso_bruto FROM vehiculos WHERE id = '$vehiculoId'";
$resultPeso = mysqli_query($conexion, $queryPeso);

if ($resultPeso) {
    $data = mysqli_fetch_assoc($resultPeso);
    $pesoBrutoInicial = $data['peso_bruto'];

    $pesoTara = $pesoActual;

    $finalizarQuery = "UPDATE vehiculos SET estatus = 'Finalizado', peso_tara = '$pesoTara', peso_neto = '$pesoNeto', hora_salida = '$exitHour' WHERE id = '$vehiculoId'";
    mysqli_query($conexion, $finalizarQuery);
    echo json_encode(['status' => 'finalizado', 'tara' => $pesoTara]);
} else {
    echo json_encode(['error' => 'No se pudo obtener el peso bruto inicial']);
}

mysqli_close($conexion);
