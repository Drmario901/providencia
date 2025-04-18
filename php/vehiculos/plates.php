<?php 
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$salida = array("data" => array());

$consulta = "SELECT * FROM dpvehiculos";        
$resultado = $conexion->query($consulta);

while ($row = $resultado->fetch_assoc()){
    $salida["data"][] = array(
        "placa" => $row['VEH_PLACA'],
        "tipo" => $row['VEH_TIPO'],
        //"peso" => $row['VEH_PESTAR'],
    );
}

echo json_encode($salida); 
$conexion->close();
?>
