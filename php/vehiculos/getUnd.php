<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");
    require __DIR__ . '/../conexion.php';
    
    $bd = "serviaves";
    mysqli_select_db($conexion, $bd);

    $salida = array("data" => array());

    $consulta = "SELECT * FROM dpundmed";
    $resultado = $conexion->query($consulta);
    $unidades = array();

    while ($rows = $resultado->fetch_assoc()) {
        $datos = $rows['UND_CODIGO'];
        if (!empty($datos)) { 
            $unidades[] = $datos;
        }
    }

    $unidades = array_unique($unidades);

    foreach ($unidades as $und) {
        $salida["data"][] = array("unidad" => $und);
    }

    echo json_encode($salida);
    $conexion->close();
?>
