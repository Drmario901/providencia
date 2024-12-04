<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';
require __DIR__. '/../documentos/observations.php';

session_start();

$bd = "serviaves";
mysqli_select_db($conexion, $bd);
date_default_timezone_set('America/Caracas');

$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    echo json_encode(['error' => 'No se recibieron datos válidos']);
    exit;
}

$userID = $_SESSION['CUENTA_ID'];
$vehiculoId = $inputData['vehiculoId'] ?? null;
$pesoBruto = $inputData['pesoBruto'] ?? null;
$observaciones = $inputData['observaciones'] ?? '';
$tipoSalida = $inputData['tipoSalida'] ?? null;
$productos = $inputData['productosSeleccionados'] ?? [];
$productosPesos = $inputData['productosPesos'] ?? [];
$precintos = $inputData['precintos'] ?? [];
$destino = $inputData['destino'] ?? null;
$exitHour = date('h:i:s');
$numDoc = $userID . $vehiculoId; 
$numDoc = str_pad($numDoc, 10, '0', STR_PAD_LEFT);

if (empty($vehiculoId) || empty($pesoBruto) || empty($tipoSalida)) {
    echo json_encode(['error' => 'Faltan datos obligatorios (vehículo, peso bruto o tipo de salida)']);
    exit;
}

$queryMainEntry = "SELECT VHP_FECHA, VHP_PLACA, VHP_PC, VHP_CODINV 
                   FROM dpvehiculospesaje 
                   WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente' 
                   LIMIT 1";
$resultMainEntry = mysqli_query($conexion, $queryMainEntry);

if (!$resultMainEntry || mysqli_num_rows($resultMainEntry) == 0) {
    echo json_encode(['error' => 'No se encontró una entrada pendiente para el vehículo']);
    exit;
}

$data = mysqli_fetch_assoc($resultMainEntry);
$fechaEntrada = $data['VHP_FECHA'];
$placa = $data['VHP_PLACA'];
$caso = $data['VHP_PC'];
$cedula = $data['VHP_CODINV'];

switch ($tipoSalida) {
    case 'salidaVaciaCaso2':
        $dataJSON = ['observaciones' => $observaciones];
        $hash = substr(hash('crc32b', json_encode($dataJSON)), 0, 6);
        storeJsonInS3($hash, $dataJSON);

        $insertSalidaQuery = "INSERT INTO dpvehiculospesaje 
                              (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV, VHP_IP) 
                              VALUES ('$vehiculoId', '$pesoBruto', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula', '$hash')";

        if (mysqli_query($conexion, $insertSalidaQuery)) {
            echo json_encode(['status' => 'finalizado', 'pesoBruto' => $pesoBruto]);
            $insertDocumento = "INSERT INTO dpdocmov (DOC_NUMERO, DOC_FECHA, DOC_NUMCBT, DOC_CODSUC, DOC_CODPER, DOC_NUMPAR) VALUES ('$numDoc', NOW(), 'NRE', '000001', '$userID', '$vehiculoId')";
            mysqli_query($conexion, $insertDocumento);
        } else {
            echo json_encode(['error' => 'No se pudo registrar la salida vacía']);
        }
        break;

        case 'despachoMateriaPrimaCaso2':
            if (empty($productos)) {
                echo json_encode(['error' => 'No se seleccionaron productos para el despacho de materia prima']);
                exit;
            }
        
            foreach ($productos as $productoCodigo) {
                $insertProductoQuery = "INSERT INTO dpmovinv 
                                        (MOV_CODIGO, MOV_FECHA, MOV_CODCOM, MOV_TIPDOC, MOV_DOCUME) 
                                        VALUES ('$productoCodigo', NOW(), '$vehiculoId', 'NEN', '$numDoc')";
                mysqli_query($conexion, $insertProductoQuery);
            }
        
            $dataJSON = [
                'observaciones' => $observaciones,
                'destino' => $destino
            ];
            $hash = substr(hash('crc32b', json_encode($dataJSON)), 0, 6);
            storeJsonInS3($hash, $dataJSON);
        
            $insertSalidaMateriaPrima = "INSERT INTO dpvehiculospesaje 
                                         (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV, VHP_IP) 
                                         VALUES ('$vehiculoId', '$pesoBruto', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula', '$hash')";
            mysqli_query($conexion, $insertSalidaMateriaPrima);

            $insertDocumento = "INSERT INTO dpdocmov (DOC_NUMERO, DOC_FECHA, DOC_NUMCBT, DOC_CODSUC, DOC_CODPER, DOC_NUMPAR) VALUES ('$numDoc', NOW(), 'NRE', '000001', '$userID', '$vehiculoId')";
            mysqli_query($conexion, $insertDocumento);
        
            echo json_encode(['status' => 'finalizado', 'productosRegistrados' => count($productos)]);
            break;        

    case 'despachoProductoTerminadoCaso2':
        if (empty($productos)) {
            echo json_encode(['error' => 'No se seleccionaron productos para el despacho de producto terminado']);
            exit;
        }

        if (empty($precintos)) {
            echo json_encode(['error' => 'No se especificaron precintos para el despacho']);
            exit;
        }

        foreach ($productos as $productoCodigo) {
            $pesoProducto = $productosPesos[$productoCodigo] ?? 0;

            if ($pesoProducto <= 0) {
                echo json_encode(['error' => "El peso del producto ($productoCodigo) no es válido"]);
                exit;
            }

            $insertProductoQuery = "INSERT INTO dpmovinv 
                                    (MOV_CODIGO, MOV_FECHA, MOV_PESO, MOV_CODCOM, MOV_TIPDOC, MOV_DOCUME) 
                                    VALUES ('$productoCodigo', NOW(), '$pesoProducto', '$vehiculoId', 'NPT', '$numDoc')";
            mysqli_query($conexion, $insertProductoQuery);
        }

        $dataJSON = [
            'observaciones' => $observaciones,
            'destino' => $destino,
            'precintos' => $precintos,
        ];
        $hash = substr(hash('crc32b', json_encode($dataJSON)), 0, 6);
        storeJsonInS3($hash, $dataJSON);

        $insertSalidaProductoTerminado = "INSERT INTO dpvehiculospesaje 
                                          (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV, VHP_IP) 
                                          VALUES ('$vehiculoId', '$pesoBruto', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula', '$hash')";
        mysqli_query($conexion, $insertSalidaProductoTerminado);

        $insertDocumento = "INSERT INTO dpdocmov (DOC_NUMERO, DOC_FECHA, DOC_NUMCBT, DOC_CODSUC, DOC_CODPER, DOC_NUMPAR) VALUES ('$numDoc', NOW(), 'NRE', '000001', '$userID', '$vehiculoId')";
            mysqli_query($conexion, $insertDocumento);

        echo json_encode(['status' => 'finalizado', 'productosRegistrados' => count($productos), 'precintos' => implode(',', $precintos)]);
        break;

    default:
        echo json_encode(['error' => 'Tipo de salida no válido']);
        break;
}

mysqli_close($conexion);
