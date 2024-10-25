<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$vehiculoId = $_POST['vehiculoId'];

$query = "SELECT estatus FROM vehiculos WHERE id = '$vehiculoId'";
$result = mysqli_query($conexion, $query);

if ($result) {
    $estatus = mysqli_fetch_assoc($result)['estatus'];
    echo json_encode(['estatus' => $estatus]);
} else {
    echo json_encode(['error' => 'No se pudo obtener el estatus']);
}

mysqli_close($conexion);
?>
