<?php 
    header("Content-Type: application/json; charset=UTF-8");
    require __DIR__ . '/../conexion.php'; 
    
    $bd = "serviaves_web";
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
