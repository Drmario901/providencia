<?php
// Base de datos
$db_host = "localhost";
$db_usuario = "root";
$db_contrasena = "";
$base_datos = "providencia";

$conexion = new mysqli($db_host, $db_usuario, $db_contrasena, $base_datos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$conexion->set_charset("utf8");
?>
