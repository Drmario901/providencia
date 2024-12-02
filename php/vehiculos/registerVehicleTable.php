<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';
require __DIR__ . '/../global.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);
date_default_timezone_set('America/Caracas'); 

$entrada = 'E';
$placa = $_POST['placa'];
$cedula = $_POST['cedula'];
$peso_bruto = $_POST['peso_bruto'];
$fecha_peso_bruto = $_POST['fecha_peso_bruto'];
$hora_entrada = date('h:i:s');
$codigo_productos = $_POST['codigo_productos'];
$estado = 'Pendiente';
$caso = $_POST['caso'];
$ip = $_SERVER['SERVER_ADDR'];
$result = $conexion->query("SELECT MAX(VHP_CODCON) AS max_num FROM dpvehiculospesaje");
$row = $result->fetch_assoc();
$user = $_SESSION['CUENTA_ID'];
$lastNum = intval($row['max_num']);
$idVeh = str_pad($lastNum + 1, 6, '0', STR_PAD_LEFT);
$numDoc = $user . $idVeh; 
$numDoc = str_pad($numDoc, 10, '0', STR_PAD_LEFT);

$query = "INSERT INTO dpvehiculospesaje (VHP_CODCON, VHP_FECHA, VHP_PLACA, VHP_CODINV, VHP_HORA, VHP_NUMASO, VHP_PC, VHP_TIPO, VHP_PESO, VHP_IP) 
          VALUES ('$idVeh', '$fecha_peso_bruto', '$placa', '$cedula', '$hora_entrada', '$estado', '$caso', '$entrada', '$peso_bruto', '$ip')";

if ($conexion->query($query)) {
    if ($caso == '0') {
        $query2 = "INSERT INTO dpmovinv (MOV_CODIGO, MOV_CODCOM, MOV_DOCUME, MOV_FECHA, MOV_TIPDOC) 
                   VALUES ('$codigo_productos', '$idVeh', '$numDoc', '$fecha_peso_bruto', 'NRE')";
        $conexion->query($query2);
    } elseif ($caso == '1') {
        $productos = explode(',', $codigo_productos);
        foreach ($productos as $codigo_producto) {
            $codigo_producto = trim($codigo_producto); 
            $query2 = "INSERT INTO dpmovinv (MOV_CODIGO,  MOV_CODCOM, MOV_DOCUME, MOV_FECHA) 
                       VALUES ('$codigo_producto', '$idVeh', '$numDoc', '$fecha_peso_bruto')";
            $conexion->query($query2);
        }
    } elseif ($caso == '2') {

    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conexion->error]);
}
?>

