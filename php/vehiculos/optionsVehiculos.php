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

    $vehiculos = array(); 

    while ($rows = $resultado->fetch_assoc()){
        $datos = $rows['VEH_TIPO'];
        $vehiculos[] = $datos;
    }

    $vehiculos = array_unique($vehiculos);

    foreach ($vehiculos as $veh){
        $salida["data"][] = array("vehiculo" => $veh); 
    }
    
    echo json_encode($salida); 
    $conexion->close();
?>
