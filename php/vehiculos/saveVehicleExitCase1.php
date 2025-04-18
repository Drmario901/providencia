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
require __DIR__. '/../documentos/observations.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);
date_default_timezone_set('America/Caracas');

$userID = $_SESSION['CUENTA_ID'];
$vehiculoId = $_POST['vehiculoId'];
$pesoProducto = $_POST['pesoProducto'] ?? NULL;
$producto = $_POST['producto'];
$unidadMedida = $_POST['unidadMedida'] ?? NULL;
$silo = $_POST['silo'];
$observaciones = $_POST['observaciones'];
$proveedor = $_POST['proveedor'];
$netoProveedor = $_POST['netoProveedor'];
$sica = $_POST['sica'];
$cantidad = $_POST['cantidad'];
$exitHour = date('h:i:s');
$numDoc = $userID .'0'. $vehiculoId; 

if (is_null($pesoProducto) || $pesoProducto <= 0) {
    echo json_encode(['error' => 'El peso del producto descargado no es válido']);
    exit;
}

$queryMainEntry = "SELECT * FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId' AND VHP_NUMASO = 'Pendiente'";
$resultMainEntry = mysqli_query($conexion, $queryMainEntry);

if (mysqli_num_rows($resultMainEntry) > 0) {
    while ($row = mysqli_fetch_assoc($resultMainEntry)) {
        $caso = $row['VHP_PC'];
        $placa = $row['VHP_PLACA'];
        $cedula = $row['VHP_CODINV'];
    }
}

$queryPeso = "SELECT VHP_PESO FROM dpvehiculospesaje WHERE VHP_CODCON = '$vehiculoId'";
$resultPeso = mysqli_query($conexion, $queryPeso);

if ($resultPeso) {
    $data = mysqli_fetch_assoc($resultPeso);
    $pesoBrutoInicial = $data['VHP_PESO'];

    $queryProductos = "SELECT MOV_CODIGO FROM dpmovinv WHERE MOV_CODCOM = '$vehiculoId' AND (MOV_PESO IS NULL OR MOV_PESO = 0)";
    $resultProductos = mysqli_query($conexion, $queryProductos);

    $productosRestantes = [];

    if ($resultProductos) {
        while ($row = mysqli_fetch_assoc($resultProductos)) {
            $productosRestantes[] = $row['MOV_CODIGO'];
        }
    }

    $updatePesoProductoQuery = "UPDATE dpmovinv SET MOV_FECHA = NOW(), MOV_PESO = '$pesoProducto', MOV_UNDMED = '$unidadMedida', MOV_CANTID = '$cantidad', MOV_CODALM = '$silo', MOV_TIPDOC = 'NRE' WHERE MOV_CODIGO = '$producto' AND MOV_CODCOM = '$vehiculoId'";
    mysqli_query($conexion, $updatePesoProductoQuery);

    $productosRestantes = array_diff($productosRestantes, [$producto]);

    if (empty($productosRestantes)) {
        $queryPesoNeto = "SELECT SUM(MOV_PESO) AS pesoNeto FROM dpmovinv WHERE MOV_CODCOM = '$vehiculoId'";
        $resultPesoNeto = mysqli_query($conexion, $queryPesoNeto);

        if ($resultPesoNeto) {
            $dataPesoNeto = mysqli_fetch_assoc($resultPesoNeto);
            $pesoNeto = $dataPesoNeto['pesoNeto'];
            $pesoTara = $pesoBrutoInicial - $pesoNeto;

            $dataJSON = [
                'observaciones' => $observaciones,
                'proveedor' => $proveedor,
                'netoProveedor' => $netoProveedor,
                'sica' => $sica,
                //'destino' => $destino,
            ];

            $hash = substr(hash('crc32b', json_encode($dataJSON)), 0, 6);

            $finalizarQuery = "INSERT INTO dpvehiculospesaje (VHP_CODCON, VHP_PESO, VHP_FECHA, VHP_HORA, VHP_NUMASO, VHP_TIPO, VHP_PC, VHP_PLACA, VHP_CODINV, VHP_IP) VALUES ('$vehiculoId', '$pesoTara', NOW(), '$exitHour', 'Finalizado', 'S', '$caso', '$placa', '$cedula', '$hash')";
            mysqli_query($conexion, $finalizarQuery);

            storeJsonInS3($hash, $dataJSON);

            $insertDocumento = "INSERT INTO dpdocmov (DOC_NUMERO, DOC_FECHA, DOC_NUMCBT, DOC_CODSUC, DOC_CODPER, DOC_NUMPAR) VALUES ('$numDoc', NOW(), 'NRE', '000001', '$userID', '$vehiculoId')";
            mysqli_query($conexion, $insertDocumento);

            echo json_encode(['status' => 'finalizado', 'tara' => $pesoTara]);
        }
    } else {
        echo json_encode(['status' => 'pendiente']);
    }
} else {
    echo json_encode(['error' => 'No se pudo obtener el peso bruto inicial del vehículo']);
}

mysqli_close($conexion);
?>
