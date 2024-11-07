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
$pesoActual = $_POST['pesoTara'];
$producto = $_POST['producto'];
$silo = $_POST['silo'];
$cantidad = $_POST['cantidad'];
$unidadMedida = $_POST['unidadMedida'];
$exitHour = date('h:i:s');

$queryMainEntry = "SELECT * FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente'";
$resultMainEntry = mysqli_query($conexion, $queryMainEntry);

if (mysqli_num_rows($resultMainEntry) > 0) {
    while ($row = mysqli_fetch_assoc($resultMainEntry)) {
        $caso = $row['VHP_PC'];
        $placa = $row['VHP_PLACA'];
        $cedula = $row['VHP_CODINV'];
    }
}

$queryPeso = "SELECT VHP_FECHA, VHP_PLACA, VHP_PESO AS peso_bruto, VHP_PC, VHP_CODINV 
              FROM dpvehiculospesaje 
              WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente' 
              LIMIT 1";
$resultPeso = mysqli_query($conexion, $queryPeso);

if ($resultPeso) {
    $data = mysqli_fetch_assoc($resultPeso);
    $pesoBrutoInicial = $data['peso_bruto'];
    $pesoTara = $pesoActual;

    $insertSalidaQuery = "INSERT INTO dpvehiculospesaje (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV) VALUES ('$vehiculoId', '$pesoTara', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula')";

    $updatePesoProductoQuery = "UPDATE dpmovinv SET MOV_FECHA = NOW(), MOV_UNDMED = '$unidadMedida', MOV_CANTID = '$cantidad', MOV_CODALM = '$silo' WHERE MOV_CODIGO = '$producto' AND MOV_DOCUME = '$vehiculoId'";
    mysqli_query($conexion, $updatePesoProductoQuery);

    if (mysqli_query($conexion, $insertSalidaQuery)) {
        echo json_encode(['status' => 'finalizado', 'tara' => $pesoTara]);
    } else {
        echo json_encode(['error' => 'No se pudo registrar la salida']);
    }
} else {
    echo json_encode(['error' => 'No se pudo obtener el peso bruto inicial']);
}

mysqli_close($conexion);
?>
