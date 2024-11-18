<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$vehiculoId = $_POST['vehiculoId'] ?? null;
if (!$vehiculoId) {
    exit;
}

$query = "SELECT VHP_NUMASO, VHP_PC FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId'";
$result = mysqli_query($conexion, $query);

if ($result) {
    $estatuses = [];
    $cases = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $estatuses[] = $row['VHP_NUMASO'];
        $cases[] = $row['VHP_PC'];
    }

    $estatus = null;
    if (in_array('Finalizado', $estatuses)) {
        $estatus = 'Finalizado';
    } elseif (in_array('Pendiente', $estatuses)) {
        $estatus = 'Pendiente';
    }

    $case = null;
    if (in_array('0', $cases)) {
        $case = 'Producto';
    } elseif (in_array('1', $cases)) {
        $case = 'Múltiple';
    } elseif (in_array('2', $cases)) {
        $case = 'Vacío';
    }

    echo json_encode([
        'estatus' => $estatus,
        'case' => $case
    ], JSON_UNESCAPED_UNICODE); 
} else {
    echo json_encode(['error' => 'No se pudo ejecutar la consulta'], JSON_UNESCAPED_UNICODE);
}

mysqli_close($conexion);
?>
