<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$vehiculoId = $_POST['vehiculoId'];

$query = "SELECT VHP_NUMASO FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId'";
$result = mysqli_query($conexion, $query);

$estatus = null;
if ($result) {
    $estatuses = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $estatuses[] = $row['VHP_NUMASO'];
    }

    if (in_array('Finalizado', $estatuses)) {
        $estatus = 'Finalizado';
    } elseif (in_array('Pendiente', $estatuses)) {
        $estatus = 'Pendiente';
    } else {
        $estatus = null;
    }
    
    echo json_encode(['estatus' => $estatus]);
} else {
    echo json_encode(['error' => 'No se pudo obtener el estatus']);
}

mysqli_close($conexion);
?>
