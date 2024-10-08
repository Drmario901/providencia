<?php 
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php'; 

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$query = "
    SELECT 
        mov_codalm AS almacen, 
        alm_descri AS tipomateria, 
        mov_codigo AS codigo, 
        inv_descri AS descripcion, 
        mov_undmed AS unidadmedida, 
        SUM(mov_cantid) AS cantidad
    FROM 
        dpmovinv
    INNER JOIN 
        dpinv ON inv_codigo = mov_codigo
    INNER JOIN 
        dpalmacen ON alm_codigo = mov_codalm
    GROUP BY 
        mov_codalm, alm_descri, mov_codigo, inv_descri, mov_undmed
";

$result = mysqli_query($conexion, $query);

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC); 
    echo json_encode($rows); 
} else {
    echo json_encode([
        "error" => mysqli_error($conexion)
    ]);
}

mysqli_close($conexion);
?>
