<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");
    
    require __DIR__ . '/../conexion.php';
    
    $bd = "serviaves";
    mysqli_select_db($conexion, $bd);

    $salida = array("data" => array());

    $consulta = "SELECT * FROM dpalmacen";
    $resultado = $conexion->query($consulta);
    $silos = array();

    while ($rows = $resultado->fetch_assoc()) {
        $datos = $rows['ALM_CODIGO'];
        if (!empty($datos)) { 
            $silos[] = $datos;
        }
    }

    $silos = array_unique($silos);

    foreach ($silos as $sil) {
        $salida["data"][] = array("silo" => $sil);
    }

    echo json_encode($salida);
    $conexion->close();
?>
