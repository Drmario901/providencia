<?php
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$vehiculoId = $_POST['vehiculoId'];
//$vehiculoId = '000016';
$query = "
   SELECT 
    entrada.VHP_CODCON AS id, 
    entrada.VHP_FECHA, 
    entrada.VHP_PLACA, 
    entrada.VHP_CODINV AS cedula, 
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
     WHERE dom.MOV_CODCOM = entrada.VHP_CODCON
    ) AS codigo_productos,
    (SELECT GROUP_CONCAT(DISTINCT inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ') 
     FROM dpinv inv 
     INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO 
     WHERE dom.MOV_CODCOM = entrada.VHP_CODCON
    ) AS productos,
    (SELECT GROUP_CONCAT(DISTINCT CONCAT(inv.INV_DESCRI, ' (Silo: ', dom.MOV_CODALM, ')') ORDER BY inv.INV_DESCRI SEPARATOR ', ')
     FROM dpinv inv
     INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO
     WHERE dom.MOV_CODCOM = entrada.VHP_CODCON
    ) AS productos_con_silos, 
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
    dpconductores cond ON entrada.VHP_CODINV = cond.CDT_CI_RIF
WHERE 
    entrada.VHP_CODCON = '$vehiculoId';

";

$result = mysqli_query($conexion, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $data = mysqli_fetch_assoc($result);
    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No se encontraron datos para el vehículo especificado.'
    ]);
}

mysqli_free_result($result);
mysqli_close($conexion);
?>
