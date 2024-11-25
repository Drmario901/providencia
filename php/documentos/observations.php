<?php
function storeObservationInFile($hash, $text, $directory = __DIR__ . '/storage/') {
    if (!is_dir($directory)) {
        mkdir($directory, 0777, true); 
    }

    $filePath = $directory . $hash . '.txt';
    file_put_contents($filePath, $text);
}

function retrieveObservationFromFile($hash, $directory = __DIR__ . '/storage/') {
    $filePath = $directory . $hash . '.txt';
    return file_exists($filePath) ? file_get_contents($filePath) : "Error";
}
?>
