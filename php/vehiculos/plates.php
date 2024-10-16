<?php 
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves_web";
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
