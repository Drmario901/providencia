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
            entrada.VHP_CODCON AS id, 
            entrada.VHP_FECHA, 
            entrada.VHP_PLACA, 
            entrada.VHP_HORA AS hora_entrada, 
            salida.VHP_HORA AS hora_salida, 
            COALESCE(salida.VHP_NUMASO, entrada.VHP_NUMASO) AS estatus, 
            entrada.VHP_PC AS caso,
            COALESCE(entrada_pendiente.VHP_PESO, entrada.VHP_PESO) AS peso_bruto, 
            salida.VHP_PESO AS peso_salida,
            (COALESCE(entrada_pendiente.VHP_PESO, entrada.VHP_PESO) - COALESCE(salida.VHP_PESO, 0)) AS peso_neto,
            (SELECT GROUP_CONCAT(DISTINCT inv.INV_CODIGO ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
             FROM dpinv inv 
             INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
             WHERE dom.MOV_DOCUME = entrada.VHP_CODCON
            ) AS codigo_productos,
            (SELECT GROUP_CONCAT(DISTINCT inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
             FROM dpinv inv 
             INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
             WHERE dom.MOV_DOCUME = entrada.VHP_CODCON
            ) AS productos,
            cond.CDT_NOMBRE AS conductor_nombre
        FROM 
            dpvehiculospesaje entrada
        LEFT JOIN 
            dpvehiculospesaje salida ON entrada.VHP_CODCON = salida.VHP_CODCON 
            AND salida.VHP_NUMASO = 'Finalizado'
            AND entrada.VHP_FECHA = salida.VHP_FECHA
        LEFT JOIN 
            dpvehiculospesaje entrada_pendiente ON entrada.VHP_CODCON = entrada_pendiente.VHP_CODCON 
            AND entrada_pendiente.VHP_NUMASO = 'Pendiente'
            AND entrada.VHP_FECHA = entrada_pendiente.VHP_FECHA
        LEFT JOIN 
            dpconductores cond ON entrada.VHP_CODINV = cond.CDT_CI_RIF";

if (!empty($fecha_filtro)) {
    $sql .= " WHERE entrada.VHP_FECHA = ?";
    $sql .= " GROUP BY entrada.VHP_CODCON, entrada.VHP_FECHA";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $fecha_filtro);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql .= " GROUP BY entrada.VHP_CODCON, entrada.VHP_FECHA";
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
