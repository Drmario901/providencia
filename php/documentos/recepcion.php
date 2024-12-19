<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../../path.php';
require __DIR__ . '/../conexion.php';
require __DIR__ . '/../global.php';
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__. '/../documentos/observations.php';

$bd = "serviaves";
mysqli_select_db($conexion, $bd);

$logoPath = __DIR__ . '/../documentos/logos/serviaves.png';
$logoBase64 = '';

if (file_exists($logoPath)) {
    $imageData = file_get_contents($logoPath);
    $logoBase64 = 'data:image/png;base64,' . base64_encode($imageData);
}

$vehiculoId = $_GET['vehiculoId'] ?? '';
//$vehiculoId = '000070'; 

$query = "
    SELECT
        entrada.VHP_CODCON AS id,
        entrada.VHP_FECHA AS fecha,
        entrada.VHP_PLACA AS placa,
        entrada.VHP_CODINV AS cedula,
        entrada.VHP_HORA AS hora_entrada,
        salida.VHP_HORA AS hora_salida,
        COALESCE(salida.VHP_NUMASO, entrada.VHP_NUMASO) AS estatus,
        entrada.VHP_PC AS caso,
        COALESCE(entrada_pendiente.VHP_PESO, entrada.VHP_PESO) AS peso_bruto,
        salida.VHP_PESO AS peso_salida,
        (COALESCE(entrada_pendiente.VHP_PESO, entrada.VHP_PESO) - COALESCE(salida.VHP_PESO, 0)) AS peso_neto,
        (SELECT GROUP_CONCAT(DISTINCT inv.INV_CODIGO ORDER BY inv.INV_DESCRI SEPARATOR ', ')
         FROM dpinv inv
         INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO
         WHERE dom.MOV_CODCOM = entrada.VHP_CODCON) AS codigo_productos,
        (SELECT GROUP_CONCAT(DISTINCT inv.INV_DESCRI ORDER BY inv.INV_DESCRI SEPARATOR ', ')
         FROM dpinv inv
         INNER JOIN dpmovinv dom ON inv.INV_CODIGO = dom.MOV_CODIGO
         WHERE dom.MOV_CODCOM = entrada.VHP_CODCON) AS productos,
        cond.CDT_NOMBRE AS conductor_nombre,
        dom.MOV_DOCUME AS documento,
        (SELECT salida_rel.VHP_IP
         FROM dpvehiculospesaje salida_rel
         WHERE salida_rel.VHP_CODCON = entrada.VHP_CODCON
           AND salida_rel.VHP_TIPO = 'S'
         LIMIT 1) AS hash 
    FROM
        dpvehiculospesaje entrada
    LEFT JOIN
        dpvehiculospesaje salida ON entrada.VHP_CODCON = salida.VHP_CODCON
        AND salida.VHP_NUMASO = 'Finalizado'
        AND salida.VHP_FECHA >= entrada.VHP_FECHA
    LEFT JOIN
        dpvehiculospesaje entrada_pendiente ON entrada.VHP_CODCON = entrada_pendiente.VHP_CODCON
        AND entrada_pendiente.VHP_NUMASO = 'Pendiente'
    LEFT JOIN
        dpconductores cond ON entrada.VHP_CODINV = cond.CDT_CI_RIF
    LEFT JOIN
        dpmovinv dom ON dom.MOV_CODCOM = entrada.VHP_CODCON
    WHERE
        entrada.VHP_CODCON = ? ";

$stmt = $conexion->prepare($query);
$stmt->bind_param("s", $vehiculoId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("No se encontraron datos para el vehículo ID: $vehiculoId");
}

$data = $result->fetch_assoc();

$nombre = $_SESSION['nUsuario'] ?? 'Sin nombre';
$exitHour = date('h:i:s A');
$exitHour2 = date('h:i:s A');
$dataJSON = retrieveJSONFromS3($data['hash']);
if (is_array($dataJSON)) {
    $observations = $dataJSON['observaciones'] ?? 'Sin datos';
    $proveedor = $dataJSON['proveedor'] ?? 'Sin datos';
    $sica = $dataJSON['sica'] ?? 'Sin datos';
    //$destination = $dataJSON['destino'] ?? 'Sin datos';
    $netoProveedor = $dataJSON['netoProveedor'] ?? 'Sin datos';
} else {
    echo "Error: $dataJSON";
}

$productos = $data['productos'] ?? 'Sin productos';
$tara = $data['peso_bruto'] - $data['peso_neto'];

use Dompdf\Dompdf;
$dompdf = new Dompdf();

$html = '
<html>
<head>
  <style>
    @page { 
        size: 8.5in 11in; /* Tamaño carta */
        margin: 5mm; /* Márgenes pequeños */
    }

    body { 
        font-family: Arial, sans-serif; 
        font-size: 8px; 
        margin: 0; 
        padding: 0;
    }

    .page-container { 
        width: 100%; 
        height: 100%;
    }

    .form-container { 
        width: 100%; 
        padding: 3mm; 
        box-sizing: border-box;
    }

    /* Asegura que los formularios estén uno encima del otro */
    .form-container {
        display: block;
    }

    /* Primer formulario (superior) */
    .form-container:first-child {
        margin-bottom: 5mm; /* Ajusta el espacio para la línea de recorte */
        border-bottom: 1px dashed #000; /* Línea de recorte */
        padding-bottom: 15px;
    }

    .logo {
        width: 80px; 
        height: auto;
        display: block;
        margin: 0 auto;
    }

    .header {
        text-align: center;
        font-weight: bold;
        font-size: 12px;
        margin-top: 6px;
    }

    .subheader {
        text-align: center;
        font-size: 8px;
        margin-top: 2px;
        margin-bottom: 10px;
    }

    .section {
        margin-bottom: 8px; 
    }

    .section div { 
        margin-bottom: 4px; 
    }

    .left, .right {
        display: inline-block;
        vertical-align: top;
        width: 48%; /* Ajuste para que quepa mejor */
    }

    .left { 
        text-align: left; 
    }

    .right { 
        text-align: right; 
    }

    .label {
        font-weight: bold;
        display: inline-block;
        width: 35%;
    }

    .value {
        display: inline-block;
        border-bottom: 1px solid black;
        padding-left: 4px;
        padding-right: 4px;
    }

    .separator-line {
        border-bottom: 1px solid black;
        margin-top: 4px;
        margin-bottom: 10px;
    }

    .line {
        display: inline-block;
        padding-left: 4px;
        padding-right: 4px;
    }

    .observation-section {
        margin-top: 15px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .observation-title {
        font-weight: bold;
        margin-bottom: 4px;
    }

    .signature-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding: 0 10px;
    }

    .signature-box {
        width: 45%;
        font-size: 8px;
        text-align: center;
    }

    .signature-line {
        border-top: 1px solid black;
        width: 100%;
        margin-top: 6px;
    }

    .hora { 
        position: absolute;
        top: 10mm; 
        right: 10mm; 
        font-size: 8px;
        text-align: right;  
    }

    .hora2 { 
        position: absolute;
        top: 150mm;  
        right: 10mm;
        font-size: 8px;
        text-align: right;  
    }

</style>
</head>
<body>
    <div class="page-container">
    <br>
    <br>';

function generateForm($data, $logoBase64, $exitHour, $nombre, $productos, $tara, $proveedor, $sica, $netoProveedor, $observations) {
    return '
    <div class="form-container">
        <div class="hora">Hora: '.$exitHour.'</div>
        <div class="hora2">Hora: '.$exitHour.'</div>
        <img src="'.$logoBase64.'" alt="Logo" class="logo">
        <div class="header">RECEPCIÓN DE MATERIA PRIMA</div>
        <div class="subheader">SERVIAVES C.A. Rif.:J40505786-6</div>

        <div class="separator-line"></div>
        <div class="section">
            <div class="left">
                <div>
                    <span class="label">FECHA:</span> 
                    <span class="value">'.$data['fecha'].'</span>
                </div>
                <div style="margin-top: 6px;">
                    <span class="label">USUARIO:</span> 
                    <span class="value">'.$nombre.'</span>
                </div>
            </div>
            <div class="right">
                <span class="label">N°:</span> 
                <span class="value">'.htmlspecialchars($data['documento'] ?? 'Sin documento').'</span>
            </div>
        </div>

        <div class="separator-line"></div>
        
        <div class="section">
            <div class="left">
                <div style="display: flex; align-items: center; white-space: nowrap;">
                    <span style="font-weight: bold;">PROVEEDOR:</span>
                    <span style="margin-left: 5px;">'.$proveedor.'</span>
                </div>
                <br><br>
                <div style="display: flex; align-items: center; white-space: nowrap;">
                    <span style="font-weight: bold;">PRODUCTO:</span>
                    <span style="margin-left: 5px;">'.$productos.'</span>
                </div>
            </div>
        </div>

        <div class="separator-line"></div>

        <div class="section">
            <div class="left">
                <b><span class="value">DATOS DEL CHOFER</span></b>
                <br><br>
                <div><span class="label">NOMBRE DEL CHOFER:</span> <span class="line">'.htmlspecialchars($data['conductor_nombre']).'</span></div>
                <div><span class="label">CÉDULA:</span> <span class="line">'.htmlspecialchars($data['cedula']).'</span></div>
                <div><span class="label">PLACA:</span> <span class="line">'.htmlspecialchars($data['placa']).'</span></div>
                <div><span class="label">SICA:</span> <span class="line">'.$sica.'</span></div>
            </div>
            <div class="right">
                <b><span class="value">DATOS DE ROMANA</span></b>
                <br><br>
                <div><span class="label">PESO BRUTO:</span> <span class="line">'.htmlspecialchars($data['peso_bruto']).'</span></div>
                <div><span class="label">TARA:</span> <span class="line">'.htmlspecialchars($tara).'</span></div>
                <div><span class="label">NETO:</span> <span class="line">'.htmlspecialchars($data['peso_neto']).'</span></div>
                <div><span class="label">NETO PROVEEDOR:</span> <span class="line">'.$netoProveedor.'</span></div>
            </div>
        </div>

        <div class="separator-line"></div>
        <br>

        <div class="section">
            <div class="left" style="margin-bottom: 12px;"> 
            <br>
                <div>
                    <span class="label">CONFORME CHOFER:</span>
                    <span style="display: inline-block; width: calc(100% - 150px); border-bottom: 1px solid black; vertical-align: middle;"></span>
                </div>
                <center><div class="signature-name" style="margin-top: 2px; margin-left: 140px;">'.htmlspecialchars($data['conductor_nombre']).'</div></center>
                <center><div class="signature-name" style="margin-top: 2px; margin-left: 140px;">CI: '.htmlspecialchars($data['cedula']).'</div></center>
            </div>
            <div class="right">
            <br>
                <div>
                    <span class="label">CONFORME ROMANA:</span>
                    <span style="display: inline-block; width: calc(100% - 150px); border-bottom: 1px solid black; vertical-align: middle;"></span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="observation-title">OBSERVACIÓN:</div>
            <span class="line">'.htmlspecialchars($observations).'</span>
        </div>
    </div>';
}

$html .= generateForm($data, $logoBase64, $exitHour, $nombre, $productos, $tara, $proveedor, $sica, $netoProveedor, $observations);
$html .= '<div class="separator-line"></div>';
$html .= generateForm($data, $logoBase64, $exitHour, $nombre, $productos, $tara, $proveedor, $sica, $netoProveedor, $observations);

$html .= '
    </div>
</body>
</html>';

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("recepcion_$vehiculoId.pdf", ["Attachment" => false]);


