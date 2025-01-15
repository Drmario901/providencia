<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/../conexion.php';
require __DIR__ . '/../global.php';
require __DIR__ . '/../documentos/observations.php'; 

$bd = "serviaves";
mysqli_select_db($conexion, $bd);
date_default_timezone_set('America/Caracas'); 

$userID = $_SESSION['CUENTA_ID'] ?? null; 
$vehiculoId = $_POST['vehiculoId'] ?? null;
$pesoActual = $_POST['pesoNeto'] ?? null;
$producto = $_POST['producto'] ?? null;
$silo = $_POST['silo'] ?? null;
$observaciones = $_POST['observaciones'] ?? null;
$proveedor = $_POST['proveedor'] ?? null;
$netoProveedor = $_POST['netoProveedor'] ?? null;
$sica = $_POST['sica'] ?? null;
$destino = $_POST['destino'] ?? null;
$cantidad = $_POST['cantidad'] ?? null;
$unidadMedida = $_POST['unidadMedida'] ?? null;
$exitHour = date('h:i:s');
$numDoc = $userID .'0'. $vehiculoId; 
//$numDoc = str_pad($numDoc, 10, '0', STR_PAD_LEFT);

if (!$vehiculoId || !$pesoActual || !$producto || !$silo || !$cantidad || !$unidadMedida) {
    echo json_encode(['error' => 'Faltan parámetros obligatorios']);
    exit;
}

$queryMainEntry = "SELECT * FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente'";
$resultMainEntry = mysqli_query($conexion, $queryMainEntry);

if ($resultMainEntry && mysqli_num_rows($resultMainEntry) > 0) {
    while ($row = mysqli_fetch_assoc($resultMainEntry)) {
        $caso = $row['VHP_PC'];
        $placa = $row['VHP_PLACA'];
        $cedula = $row['VHP_CODINV'];
    }
}

$queryPeso = "SELECT VHP_FECHA, VHP_PLACA, VHP_PESO AS peso_bruto, VHP_PC, VHP_CODINV 
              FROM dpvehiculospesaje 
              WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente' 
              LIMIT 1";
$resultPeso = mysqli_query($conexion, $queryPeso);

if ($resultPeso) {
    $data = mysqli_fetch_assoc($resultPeso);
    $pesoBrutoInicial = $data['peso_bruto'];
    $pesoTara = $pesoBrutoInicial - $pesoActual;
    $dataJSON = [
        'observaciones' => $observaciones,
        'proveedor' => $proveedor,
        'netoProveedor' => $netoProveedor,
        'sica' => $sica,
        //'destino' => $destino,
    ];

    $hash = substr(hash('crc32b', json_encode($dataJSON)), 0, 6);

    $insertSalidaQuery = "INSERT INTO dpvehiculospesaje (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV, VHP_IP) 
                          VALUES ('$vehiculoId', '$pesoTara', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula', '$hash')";


    storeJsonInS3($hash, $dataJSON);

    if (mysqli_query($conexion, $insertSalidaQuery)) {
        $insertDocumento = "INSERT INTO dpdocmov (DOC_NUMERO, DOC_FECHA, DOC_NUMCBT, DOC_CODSUC, DOC_CODPER, DOC_NUMPAR) 
                            VALUES ('$numDoc', NOW(), 'NRE', '000001', '$userID', '$vehiculoId')";
        mysqli_query($conexion, $insertDocumento);

        $updatePesoProductoQuery = "UPDATE dpmovinv 
                                SET MOV_FECHA = NOW(), MOV_UNDMED = '$unidadMedida', MOV_CANTID = '$cantidad', MOV_CODALM = '$silo' 
                                WHERE MOV_CODIGO = '$producto' AND MOV_CODCOM = '$vehiculoId'";
        mysqli_query($conexion, $updatePesoProductoQuery);

        echo json_encode(['status' => 'finalizado', 'tara' => $pesoTara]);
    } else {
        error_log("Error al insertar la salida: " . mysqli_error($conexion)); 
        echo json_encode(['error' => 'No se pudo registrar la salida']);
    }
} else {
    error_log("Error al obtener el peso bruto inicial: " . mysqli_error($conexion)); 
    echo json_encode(['error' => 'No se pudo obtener el peso bruto inicial']);
}

mysqli_close($conexion);
?>
