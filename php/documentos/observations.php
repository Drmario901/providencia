<?php

function getFilePath($hash, $folder = 'storage') {
    $directory = __DIR__ . '/' . $folder;
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    return $directory . '/' . $hash . '.json';
}

function storeJsonInS3($hash, $data, $folder = 'storage') {
    $filePath = getFilePath($hash, $folder);

    try {
        file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $filePath; 
    } catch (Exception $e) {
        return $e->getMessage(); 
    }
}

function retrieveJsonFromS3($hash, $folder = 'storage') {
    $filePath = getFilePath($hash, $folder);

    try {
        if (!file_exists($filePath)) {
            throw new Exception($filePath);
        }

        $jsonData = json_decode(file_get_contents($filePath), true);
        return $jsonData; 
    } catch (Exception $e) {
        return $e->getMessage(); 
    }
}

?>
