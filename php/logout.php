<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'global.php';

session_start();
session_unset();
session_write_close();

$fullUrl = isset($_POST['fullUrl']) ? $_POST['fullUrl'] : '';
echo json_encode([
    'success' => true,
    'redirectUrl' => $fullUrl,
]);
