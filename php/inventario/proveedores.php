<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    header("Content-Type: application/json; charset=UTF-8");
    require __DIR__ . '/../conexion.php';
    
    $bd = "serviaves";
    mysqli_select_db($conexion, $bd);

    $salida = array("data" => array());

    $consulta = "SELECT DISTINCT PRO_NOMBRE FROM dpproveedor";
    $resultado = $conexion->query($consulta);
    $proveedores = array();

    while ($rows = $resultado->fetch_assoc()) {
        $datos = $rows['PRO_NOMBRE'];
        if (!empty($datos)) { 
            $proveedores[] = $datos;
        }
    }

    $proveedores = array_unique($proveedores);

    foreach ($proveedores as $proveedores) {
        $salida["data"][] = array("proveedores" => $proveedores);
    }

    echo json_encode($salida);
    $conexion->close();
?>
