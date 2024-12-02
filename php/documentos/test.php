<?php
require __DIR__ . '/../../aws/aws-autoloader.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

function getS3Client() {
    return new Aws\S3\S3Client([
        'endpoint' => 'https://s3.us-east-005.backblazeb2.com',
        'region' => 'us-east-005',
        'version' => 'latest',
        'credentials' => [
            'key' => '0056c4285f689de0000000001',
            'secret' => 'K005InT/+6RiaOCkW41yb0WKHsA3TBM',
        ],
    ]);
}

function storeJsonInS3($hash, $bucket, $data, $folder = 'storage') {
    $s3 = getS3Client();
    $key = $folder . '/' . $hash . '.json';

    try {
        $s3->putObject([
            'Bucket' => $bucket,
            'Key' => $key,
            'Body' => json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            'ContentType' => 'application/json',
        ]);
        return $key;
    } catch (AwsException $e) {
        return $e->getMessage();
    }
}

function retrieveJsonFromS3($hash, $bucket, $folder = 'storage') {
    $s3 = getS3Client();
    $key = $folder . '/' . $hash . '.json';

    try {
        $result = $s3->getObject([
            'Bucket' => $bucket,
            'Key' => $key,
        ]);

        $jsonData = json_decode($result['Body'], true);
        return $jsonData;
    } catch (AwsException $e) {
        return $e->getMessage();
    }
}

?>
