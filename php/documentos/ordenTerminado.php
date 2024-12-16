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
//$vehiculoId = '000005';
$netoProveedor = $_POST['netoProveedor'] ?? 'Sin neto de proveedor';
//$destino = $_POST['destino'] ??  'Sin destino';
$proveedor = $_POST['proveedor'] ?? 'Sin proveedor';
$nombre = $_SESSION['nUsuario'] ?? 'Sin nombre';

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
    inv.INV_CODIGO AS codigo_producto,
    inv.INV_DESCRI AS descripcion_producto,
    dom.MOV_CANTID AS cantidad,
    dom.MOV_PESO AS peso_producto,
    dom.MOV_UNDMED AS unidad_medida,
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
LEFT JOIN
    dpinv inv ON inv.INV_CODIGO = dom.MOV_CODIGO
WHERE
    entrada.VHP_CODCON = ?;";

$stmt = $conexion->prepare($query);
$stmt->bind_param("s", $vehiculoId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("No se encontraron datos para el vehículo ID: $vehiculoId");
}

$data = $result->fetch_assoc();

$fecha = $data['fecha'] ?? 'No hay fecha.';
$exitHour = date('h:i:s A');
$cedula = $data['cedula'] ?? 'Sin cédula';
$tara = $data['peso_bruto'] - $data['peso_neto']; 
$hora_entrada = $data['hora_entrada'] ?? 'Hora de entrada no disponible';
$hora_salida = $data['hora_salida'] ?? 'Hora de salida no disponible';
$estatus = $data['estatus'] ?? 'Estatus no disponible';
$caso = $data['caso'] ?? 'Caso no disponible';
$conductor_nombre = $data['conductor_nombre'] ?? 'Conductor no disponible';
$documento = $data['documento'] ?? 'Documento no disponible';
$productos = $data['productos'] ?? 'Sin productos';
$placa = $data['placa'] ?? 'Sin placa';
$peso_neto = $data['peso_neto'] ?? 'Sin peso neto';
$peso_bruto = $data['peso_bruto'] ?? 'Sin peso bruto';
$dataJSON = retrieveJSONFromS3($data['hash']);
if (is_array($dataJSON)) {
    $precintos = $dataJSON['precintos'] ?? 'Sin datos';
    $destino = $dataJSON['destino'] ?? 'Sin datos';
    $precintosF = implode(', ', $precintos);
} else {
    echo "Error: $dataJSON";
}

$tabla = '<div class="section" style="text-align: center; margin: 20px;">
<table style="width: 98%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd; font-family: Arial, sans-serif;">
    <thead style="background-color: #f4f4f4;">
        <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Código</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Descripción</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Peso Neto</th>
        </tr>
    </thead>
    <tbody>';

$totalPesoNeto = 0;
$codigosAgregados = [];

while ($data = $result->fetch_assoc()) {
    $codigo = htmlspecialchars($data['codigo_producto'] ?? 'Sin código');

    if (in_array($codigo, $codigosAgregados)) {
        continue; 
    }
    
    $codigosAgregados[] = $codigo;
    
    $descripcion = htmlspecialchars($data['descripcion_producto'] ?? 'Sin descripción');
    $cantidad = htmlspecialchars($data['cantidad'] ?? 0);
    $pesoNeto = htmlspecialchars($data['peso_producto'] ?? 0);
    $unidad_medida = htmlspecialchars($data['unidad_medida'] ?? 'KG');

    $cantidad = ltrim($cantidad, '0');
    $cantidad = $cantidad === '' ? '0' : $cantidad;
    $pesoNeto = ltrim($pesoNeto, '0');
    $pesoNeto = $pesoNeto === '' ? '0' : $pesoNeto;

    if (strpos($cantidad, '.') !== false) {
        $cantidad = rtrim($cantidad, '0'); 
        $cantidad = rtrim($cantidad, '.'); 
    }
    
    if (strpos($pesoNeto, '.') !== false) {
        $pesoNeto = rtrim($pesoNeto, '0'); 
        $pesoNeto = rtrim($pesoNeto, '.'); 
    }
    
    $totalPesoNeto += floatval($pesoNeto);

    $toneladas = $pesoNeto / 1000;  
    $toneladas = number_format($toneladas, 2);  
    
    $tabla .= "<tr>
            <td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>$codigo</td>
            <td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>$descripcion</td>
            <td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>$pesoNeto ".$unidad_medida."</td>
            <td style='padding: 10px; border: 1px solid #ddd; text-align: right;'>$toneladas TON</td>
        </tr>";
    
}

$tabla .= "<tr style='background-color: #f4f4f4; font-weight: bold;'>
    <td colspan='3' style='padding: 10px; border: 1px solid #ddd; text-align: center;'>TOTAL</td>
    <td style='padding: 10px; border: 1px solid #ddd; text-align: right;'>$totalPesoNeto KG</td>
</tr>";

$tabla .= '</tbody>
</table>
</div>';
   
use Dompdf\Dompdf;
$dompdf = new Dompdf();

$html = '
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; }
        .container { width: 90%; margin: 0 auto; padding-top: 20px; }
        .logo {
            width: 120px;
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
        }
        .subheader {
            text-align: center;
            font-size: 12px;
            margin-top: 5px;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section div {
            margin-bottom: 5px;
        }
        .left, .right {
            display: inline-block;
            vertical-align: top;
            width: 48%;
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
            width: 40%;
        }
        .value {
            display: inline-block;
            border-bottom: 1px solid black;
            padding-left: 5px;
            padding-right: 5px;
        }

        .line {
            display: inline-block;
            /*border-bottom: 1px solid black;*/
            padding-left: 5px;
            padding-right: 5px;
        }

        .separator-line {
            border-bottom: 1px solid black;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        .observation-section {
            margin-top: 30px;
            padding-left: 20px;
            padding-right: 20px;
        }
        .observation-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .observation-line {
            border-bottom: 1px solid black;
            width: 100%;
            height: 50px;
            margin-top: 5px;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 40px;
            padding: 0 20px;
        }
        .signature-box {
            width: 45%;
            font-size: 12px;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid black;
            width: 100%;
            margin-top: 10px;
        }
        .signature-label {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .signature-name {
            margin-top: 5px;
        }

        .hora { 
            position: absolute; top: 20mm; 
            right: 20mm; 
            font-size: 12px; text-align: right;  
        }
    </style>
</head>
<body>
    <div class="hora">Hora: '.$exitHour.'</div>
    <div class="container">
        <img src="' . $logoBase64 . '" alt="Logo" class="logo">
        <div class="header">DESPACHO DE PRODUCTO TERMINADO</div>
        <div class="subheader">SERVIAVES C.A. Rif.:J40505786-6</div>
        
         <div class="separator-line"></div>
            <div class="section">
            <div class="left">
            <span class="label">ORDEN N°:</span> 
                <span class="value">'.htmlspecialchars($documento).'</span>

                <div style="margin-top: 10px;">
                    <span class="label">DESTINO:</span> 
                    <span class="line">'.$destino.'</span>
                </div>
            </div>
            <div class="right">
                <div>
                    <span class="label">FECHA:</span> 
                    <span class="value">'.$fecha.'</span>
                </div>
                <div style="margin-top: 10px;">
                    <span class="label">USUARIO:</span> 
                    <span class="value">'.$nombre.'</span>
                </div>
        </div>

    <div class="separator-line"></div>
        <div class"section">
            '.$tabla.'
            </div>
    <div class="separator-line"></div>
        <div class="section">
            <div class="left">
                <b><span class="value">DATOS DEL CHOFER</span></b>
                <br> 
                <br>
                <div><span class="label">NOMBRE DEL CHOFER:</span> <span class="line">'.htmlspecialchars($conductor_nombre).'</span></div>
                <div><span class="label">CÉDULA:</span> <span class="line">'.htmlspecialchars($cedula).'</span></div>
                <div><span class="label">PLACA:</span> <span class="line">'.htmlspecialchars($placa).'</span></div>
            </div>
            <div class="right">
                <b><span class="value">DATOS DE ROMANA</span></b> 
                <br> 
                <br>
                <div><span class="label">PESO BRUTO:</span> <span class="line">'.htmlspecialchars($peso_bruto).'</span></div>
                <div><span class="label">TARA:</span> <span class="line">'.htmlspecialchars($tara).'</span></div>
                <div><span class="label">NETO:</span> <span class="line">'.htmlspecialchars($peso_neto).'</span></div>
            </div>
        </div>
        <div class="separator-line"></div>
        <br>
        <br>
        <br>

     <div class="section">
            <div class="left" style="margin-bottom: 20px;"> 
        <div>
            <span class="label">CONFORME CHOFER:</span>
            <span style="display: inline-block; width: calc(100% - 150px); border-bottom: 1px solid black; vertical-align: middle; margin-left: 10px;"></span>
    </div>
        <div class="signature-name" style="margin-top: 3px; margin-left: 155px;">'.htmlspecialchars($conductor_nombre).'</div>
        <div class="signature-name" style="margin-top: 3px; margin-left: 155px;">CI: '.htmlspecialchars($cedula).'</div>
    </div>
            <div class="right">
                <div>
                    <span class="label">CONFORME ROMANA:</span>
                    <span style="display: inline-block; width: calc(100% - 150px); border-bottom: 1px solid black; vertical-align: middle; margin-left: 10px;"></span>
                </div>
            </div>
        </div>

        <div class="left">
            <div class="observation-title">PRECINTOS:</div>
            <span>'.$precintosF.'</span>
            <!--div class="observation-line"></div-->
        </div>
    </div>
</body>
</html>
';

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("despacho_producto_terminado_$vehiculoId.pdf", ["Attachment" => false]);
?>
