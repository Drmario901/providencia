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

$vehiculoId = $_POST['vehiculoId'];
$query = "SELECT VHP_PESO FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId'";
$result = mysqli_query($conexion, $query);

if ($result) {
    $pesoTara = mysqli_fetch_assoc($result)['VHP_PESO'];
    echo json_encode(['pesoBruto' => $pesoTara]);
} else {
    echo json_encode(['error' => 'No se pudo obtener el peso bruto']);
}

mysqli_close($conexion);
?>
