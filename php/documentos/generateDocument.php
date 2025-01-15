<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require __DIR__ . '/../conexion.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$vehiculoId = $_POST['vehiculoId'] ?? '';  

try {
    $sql = "SELECT MOV_TIPDOC 
            FROM dpmovinv 
            WHERE MOV_CODCOM = $vehiculoId 
            LIMIT 1";
    $result = $conexion->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $tipoDocumento = $row['MOV_TIPDOC'];
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No hay documento.'
        ]);
        exit;
    }

    $response = [
        'success' => true,
        'message' => 'Presione para redirigir y visualizar PDF.',
        'tipoDocumento' => $tipoDocumento,
        'vehiculoId' => $vehiculoId
    ];

    switch ($tipoDocumento) {
        case 'NRE':
            // $response['redirectUrl'] = "/providencia/vehiculos/documentos/recepcion?vehiculoId=$vehiculoId";
            $response['redirectUrl'] = "http://api-serviaves.zapto.org/providencia/vehiculos/documentos/recepcion?vehiculoId=$vehiculoId";
             break;

        case 'NEN':
            // $response['redirectUrl'] = "/providencia/vehiculos/documentos/despacho?vehiculoId=$vehiculoId";
            $response['redirectUrl'] = "http://api-serviaves.zapto.org/providencia/vehiculos/documentos/despacho?vehiculoId=$vehiculoId";
            break;
        
        case 'NPT':
            // $response['redirectUrl'] = "/providencia/vehiculos/documentos/producto_terminado?vehiculoId=$vehiculoId";
            $response['redirectUrl'] = "http://api-serviaves.zapto.org/providencia/vehiculos/documentos/producto_terminado?vehiculoId=$vehiculoId";
            break;

        default:
            $response['success'] = false;
            $response['message'] = 'Tipo de documento no soportado: ' . $tipoDocumento;
            break;
    }

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
    ]);
    exit;
}
