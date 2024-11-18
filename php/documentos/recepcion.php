<?php
require __DIR__ . '/../../vendor/autoload.php';
$logoPath = __DIR__. '../../../../src/img/serviaves.png';

use Dompdf\Dompdf;
$dompdf = new Dompdf();

echo $html = '
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; position: relative; }
        .container { width: 90%; margin: 0 auto; padding-top: 20px; position: relative; }
        .logo { width: 100px; height: auto; position: absolute; top: 20px; left: 20px; }
        .header { text-align: center; font-weight: bold; font-size: 16px; margin-top: 0; }
        .subheader { text-align: center; font-size: 12px; margin-top: 5px; margin-bottom: 20px; }
        
        .section-title { font-weight: bold; }

        /* Estilos de secciones principales */
        .section { margin-bottom: 20px; }
        .section div { margin-bottom: 5px; }

        .left, .right {
            display: inline-block;
            vertical-align: top;
            width: 48%;
        }

        /* Estilos específicos de datos */
        .label { font-weight: bold; display: inline-block; width: 40%; }
        .value { display: inline-block; border-bottom: 1px solid black; padding-left: 5px; padding-right: 5px; }

        /* Línea de separación bajo la sección azul */
        .separator-line { border-bottom: 1px solid black; margin-top: 5px; margin-bottom: 15px; }

        /* Sección de observación */
        .observation-section { margin-top: 40px; padding-left: 20px; padding-right: 20px; }
        .observation-title { font-weight: bold; margin-bottom: 5px; }
        .observation-line { border-bottom: 1px solid black; width: 100%; height: 50px; margin-top: 5px; }

        /* Sección de firmas ajustada */
        .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 40px;
            padding: 0 20px;
        }
        .signature-box {
            width: 45%;
            font-size: 12px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
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
    </style>
</head>
<body>
    <div class="container">
        <img src="'.$logoPath.'" alt="Logo" class="logo">
        
        <div class="header">RECEPCIÓN DE MATERIA PRIMA</div>
        <div class="subheader">Protocolo de Almacén de Productos e Insumos</div>
        
        <!-- Sección de proveedor y producto -->
        <div class="section">
            <div class="left">
                <span class="label">PROVEEDOR:</span> 
                <span class="value">MOCASA</span>
            </div>
            <div class="right" style="text-align: right;">
                <span class="label">PRODUCTO:</span> 
                <span class="value">AFRECHILLO DE TRIGO</span>
            </div>
        </div>

        <!-- Sección de fecha y número -->
        <div class="section">
            <div class="left">
                <span class="label">FECHA:</span> 
                <span class="value">14/10/2024</span>
            </div>
            <div class="right" style="text-align: right;">
                <span class="label">N°:</span> 
                <span class="value">07518</span>
            </div>
        </div>

        <!-- Línea de separación -->
        <div class="separator-line"></div>

        <!-- Sección de datos del chofer -->
        <div class="section">
            <div class="left">
                <div><span class="section-title">DATOS DEL CHOFER</span></div>
                <div><span class="label">NOMBRE DEL CHOFER:</span> <span class="value">GIOVANNY AMARO</span></div>
                <div><span class="label">CÉDULA:</span> <span class="value">10.458.969</span></div>
                <div><span class="label">PLACA:</span> <span class="value">A95AUJP</span></div>
                <div><span class="label">SICA:</span> <span class="value">1559200533</span></div>
            </div>

            <!-- Sección de datos de romana -->
            <div class="right" style="text-align: right;">
                <div><span class="section-title">DATOS DE ROMANA</span></div>
                <div><span class="label">PESO BRUTO:</span> <span class="value">43,360.00</span></div>
                <div><span class="label">TARA:</span> <span class="value">15,400.00</span></div>
                <div><span class="label">NETO:</span> <span class="value">27,960.00</span></div>
                <div><span class="label">NETO PROVEEDOR:</span> <span class="value">27,980.00</span>
            </div>
        </div>

        <!-- Sección de observación -->
        <div class="observation-section">
            <div class="observation-title">OBSERVACIÓN:</div>
            <div class="observation-line"></div>
        </div>

        <!-- Sección de firmas ajustada: Conforme Chofer a la izquierda y Conforme Romana a la derecha -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-label">CONFORME CHOFER</div>
                <div class="signature-line"></div>
                <div class="signature-name">GIOVANNY AMARO</div>
                <div>10.458.969</div>
            </div>
            <div class="signature-box">
                <div class="signature-label">CONFORME ROMANA</div>
                <div class="signature-line"></div>
                <div class="signature-name">CONFORME ROMANA</div>
            </div>
        </div>
    </div>
</body>
</html>
';

$dompdf = new Dompdf();
$dompdf->loadHtml($html);

$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("recepcion_materia_prima.pdf", ["Attachment" => false]);
