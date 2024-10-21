<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$id = $_POST['id'];
$peso_bruto = $_POST['peso_bruto'];
$peso_neto = $_POST['peso_neto'];
$hora_salida = date("H:i:s");  
$estatus = 'Finalizado';  

$query = "UPDATE vehiculos 
          SET peso_bruto = '$peso_bruto', peso_neto = '$peso_neto', hora_salida = '$hora_salida', estatus = '$estatus' 
          WHERE id = '$id'";

if ($conexion->query($query)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conexion->error]);
}
