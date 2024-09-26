<?php
// Base de datos
require __DIR__. '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$db_host = $_ENV['DB_HOST'];
$db_usuario = $_ENV['DB_USERNAME'];
$db_contrasena = $_ENV['DB_PASSWORD'];
$base_datos = $_ENV['DB_DATABASE'];

$conexion = new mysqli($db_host, $db_usuario, $db_contrasena, $base_datos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$conexion->set_charset("utf8");
?>
