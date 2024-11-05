<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);
date_default_timezone_set('America/Caracas'); 

$vehiculoId = $_POST['vehiculoId'];
$pesoActual = $_POST['pesoBruto'];
$exitHour = date('H:i:s');

$queryMainEntry = "SELECT VHP_FECHA, VHP_PLACA, VHP_PC, VHP_CODINV 
                   FROM dpvehiculospesaje 
                   WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente' 
                   LIMIT 1";
$resultMainEntry = mysqli_query($conexion, $queryMainEntry);

if ($resultMainEntry && mysqli_num_rows($resultMainEntry) > 0) {
    $data = mysqli_fetch_assoc($resultMainEntry);
    $fechaEntrada = $data['VHP_FECHA'];
    $placa = $data['VHP_PLACA'];
    $caso = $data['VHP_PC'];
    $cedula = $data['VHP_CODINV'];

    $pesoTara = $pesoActual;
    $insertSalidaQuery = "INSERT INTO dpvehiculospesaje (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV) 
                          VALUES ('$vehiculoId', '$pesoTara', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula')";

    if (mysqli_query($conexion, $insertSalidaQuery)) {
        echo json_encode(['status' => 'finalizado', 'tara' => $pesoTara]);
    } else {
        echo json_encode(['error' => 'No se pudo registrar la salida']);
    }
} else {
    echo json_encode(['error' => 'No se pudo obtener el registro de entrada pendiente']);
}

mysqli_close($conexion);
?>
