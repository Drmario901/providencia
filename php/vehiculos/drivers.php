<?php 

 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
 
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$salida = array();
$consulta = "SELECT DISTINCT CDT_NOMBRE, CDT_CI_RIF, CDT_GRLIC 
             FROM dpconductores 
             WHERE CDT_NOMBRE != '' AND CDT_CI_RIF != '' AND CDT_GRLIC != ''";

$resultado = $conexion->query($consulta);

if ($resultado) {
    while ($row = $resultado->fetch_assoc()) {
        $salida[] = array(
            'nombre' => $row['CDT_NOMBRE'],
            'ci_rif' => $row['CDT_CI_RIF'],
            'grlic' => $row['CDT_GRLIC']
        );
    }
}

echo json_encode(array('data' => $salida), JSON_UNESCAPED_UNICODE);
$conexion->close();
?>
