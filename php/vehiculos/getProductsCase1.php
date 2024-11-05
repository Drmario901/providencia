<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$vehiculoId = isset($_POST['vehiculoId']) ? $_POST['vehiculoId'] : null;

if (is_null($vehiculoId)) {
    echo json_encode(['error' => 'El ID del vehículo no está definido']);
    exit;
}

$query = "
    SELECT m.MOV_CODIGO, i.INV_DESCRI 
    FROM dpmovinv m 
    JOIN dpinv i ON m.MOV_CODIGO = i.INV_CODIGO 
    WHERE m.MOV_DOCUME = '$vehiculoId'
    AND (m.MOV_PESO IS NULL OR m.MOV_PESO = 0)
";

$result = mysqli_query($conexion, $query);
$productosFinal = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $productosFinal[] = [
            'codigo' => trim($row['MOV_CODIGO']), 
            'descripcion' => trim($row['INV_DESCRI']) 
        ];
    }
    
    if (empty($productosFinal)) {
        echo json_encode(['mensaje' => 'No se encontraron productos sin peso']);
    } else {
        echo json_encode($productosFinal);
    }
} else {
    echo json_encode(['error' => 'Error en la consulta: ' . mysqli_error($conexion)]);
}

mysqli_close($conexion);
?>
