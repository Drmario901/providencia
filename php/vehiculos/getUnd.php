<?php
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
