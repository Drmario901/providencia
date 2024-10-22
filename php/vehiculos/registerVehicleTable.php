<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';

$bd = "serviaves_web";
mysqli_select_db($conexion, $bd);

$placa = $_POST['placa'];
$conductor = $_POST['conductor'];
$cedula = $_POST['cedula'];
$tipo = $_POST['tipo'];
$peso_tara = $_POST['peso_tara'];
$fecha_peso_tara = $_POST['fecha_peso_tara'];
$hora_entrada = $_POST['hora_entrada'];
$vehiculo_activo = $_POST['vehiculo_activo'];
$codigo_productos = $_POST['codigo_productos'];
$producto_ingresado = $_POST['producto_ingresado'];
$estado = 'Pendiente';
$caso = $_POST['caso'];  

$query = "INSERT INTO vehiculos (placa, conductor, cedula, tipo, peso_tara, fecha_peso_tara, hora_entrada, vehiculo_activo, codigo_productos, producto_ingresado, estatus, caso) 
          VALUES ('$placa', '$conductor','$cedula', '$tipo', '$peso_tara', '$fecha_peso_tara', '$hora_entrada', '$vehiculo_activo', '$codigo_productos', '$producto_ingresado', '$estado', '$caso')";

if ($conexion->query($query)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conexion->error]);
}
?>
