<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$fecha_filtro = isset($_POST['fecha']) ? $_POST['fecha'] : '';

$sql = "SELECT 
            dp.VHP_CODCON AS id, 
            dp.VHP_FECHA, 
            dp.VHP_PLACA, 
            dp.VHP_HORA, 
            dp.VHP_NUMASO AS estatus, 
            dp.VHP_PC AS caso,
            dp.VHP_PESO AS peso_bruto, 
            GROUP_CONCAT(inv.INV_CODIGO ORDER BY inv.INV_DESCRI SEPARATOR ', ') AS codigo_productos,
            GROUP_CONCAT(inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ') AS productos,
            cond.CDT_NOMBRE AS conductor_nombre
        FROM 
            dpvehiculospesaje dp
        LEFT JOIN 
            dpmovinv dom ON dp.VHP_CODCON = dom.MOV_DOCUME
        LEFT JOIN 
            dpinv inv ON dom.MOV_CODIGO = inv.INV_CODIGO
        LEFT JOIN 
            dpconductores cond ON dp.VHP_CODINV = cond.CDT_CI_RIF";

if (!empty($fecha_filtro)) {
    $sql .= " WHERE dp.VHP_FECHA = ?";
    $sql .= " GROUP BY dp.VHP_CODCON";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $fecha_filtro);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql .= " GROUP BY dp.VHP_CODCON";
    $result = $conexion->query($sql);
}

$registros = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        switch ($row['caso']) {
            case '0': 
                $productoIngresado = explode(', ', $row['productos'])[0];
                break;
            case '1': 
                $productoIngresado = $row['productos'];
                break;
            case '2': 
                $productoIngresado = '';
                break;
            default:
                $productoIngresado = '';
                break;
        }

        $row['producto_ingresado'] = $productoIngresado;
        $registros[] = $row;
    }
}

echo json_encode($registros);
$conexion->close();
?>
