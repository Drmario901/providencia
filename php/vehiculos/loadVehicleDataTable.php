<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$fecha_filtro = isset($_POST['fecha']) ? $_POST['fecha'] : '';

$sql = "SELECT id, conductor, placa, tipo, peso_bruto, fecha_peso_bruto, hora_entrada, codigo_productos, producto_ingresado, vehiculo_activo, peso_tara, peso_neto, hora_salida, estatus, caso  FROM vehiculos";

if (!empty($fecha_filtro)) {
    $sql .= " WHERE fecha_peso_bruto = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $fecha_filtro);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conexion->query($sql);
}

$registros = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
}

echo json_encode($registros);

$conexion->close();
?>
