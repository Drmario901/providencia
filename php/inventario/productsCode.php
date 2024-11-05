<?php 
    header("Content-Type: application/json; charset=UTF-8");
    require __DIR__ . '/../conexion.php'; 
    
    $bd = "serviaves";
    mysqli_select_db($conexion, $bd);

    $salida = array("data" => array());

    $consulta = "SELECT INV_CODIGO, INV_DESCRI FROM dpinv";        
    $resultado = $conexion->query($consulta);

    $productos = array(); 

    while ($rows = $resultado->fetch_assoc()){
        $codigo = $rows['INV_CODIGO'];
        $nombre = $rows['INV_DESCRI'];
        $productos[] = array("codigo" => $codigo, "nombre" => $nombre);
    }

    $productos = array_unique($productos, SORT_REGULAR);

    foreach ($productos as $producto){
        $salida["data"][] = $producto; 
    }
    
    echo json_encode($salida); 
    $conexion->close();
?>
