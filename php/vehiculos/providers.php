<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$query = "SELECT DISTINCT PRO_CODIGO, PRO_NOMBRE FROM dpproveedor;";

$result = mysqli_query($conexion, $query);
$proveedores = [];
$unique_codes = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $codigo = trim($row['PRO_CODIGO']);
        if (!in_array($codigo, $unique_codes)) {
            $unique_codes[] = $codigo;
            $proveedores[] = [
                'codigo' => $codigo,
                'nombre' => trim($row['PRO_NOMBRE'])
            ];
        }
    }
    
    if (empty($proveedores)) {
        echo json_encode(['mensaje' => 'No se encontraron proveedores']);
    } else {
        echo json_encode($proveedores);
    }
} else {
    echo json_encode(['error' => mysqli_error($conexion)]);
}

mysqli_close($conexion);
?>
