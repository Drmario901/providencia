<?php 
    header("Content-Type: application/json; charset=UTF-8");
    require __DIR__ . '/../conexion.php'; 
    
    $bd = "serviaves";
    mysqli_select_db($conexion, $bd);

    $salida = array("data" => array());

    $consulta = "
        SELECT DISTINCT 
            dpinv.INV_CODIGO AS codigo, 
            dpinv.INV_DESCRI AS nombre
        FROM 
            dpinv
        INNER JOIN 
            dpmovinv ON dpinv.INV_CODIGO = dpmovinv.MOV_CODIGO
        WHERE 
            dpmovinv.MOV_CODALM IN ('201', '202', '203')";

    $resultado = $conexion->query($consulta);

    $productos = array(); 

    while ($rows = $resultado->fetch_assoc()) {
        $productos[] = array(
            "codigo" => $rows['codigo'], 
            "nombre" => $rows['nombre']
        );
    }
    
    foreach ($productos as $producto) {
        $salida["data"][] = $producto; 
    }
    
    echo json_encode($salida); 
    $conexion->close();
?>
