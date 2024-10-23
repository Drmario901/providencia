<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$vehiculoId = $_POST['vehiculoId']; 

$query = "SELECT producto_ingresado FROM vehiculos WHERE id = '$vehiculoId'";
$result = mysqli_query($conexion, $query);

$productos = [];

if ($row = mysqli_fetch_assoc($result)) {
    $productos = explode(',', $row['producto_ingresado']);
}

$productosFinal = [];
foreach ($productos as $codigo) {
    $codigoLimpio = trim($codigo); 
    $productosFinal[] = [
        'nombre' => $codigoLimpio
    ];
}

echo json_encode($productosFinal);
?>
