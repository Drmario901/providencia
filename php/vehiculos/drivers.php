<?php 
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$salida = array("data" => array());

$consulta = "SELECT CDT_NOMBRE, CDT_CI_RIF, CDT_GRLIC, CDT_TEL1, CDT_DIR1 FROM dpconductores 
             WHERE CDT_NOMBRE != '' AND CDT_CI_RIF != '' AND CDT_GRLIC != ''";        
$resultado = $conexion->query($consulta);

while ($row = $resultado->fetch_assoc()){
    $salida["data"][] = array(
        "nombre" => $row['CDT_NOMBRE'],
        "ci_rif" => $row['CDT_CI_RIF'],
        "grlic" => $row['CDT_GRLIC'],
        "telefono" => $row['CDT_TEL1'],
        "direccion" => $row['CDT_DIR1']
    );
}

echo json_encode($salida); 
$conexion->close();
?>
