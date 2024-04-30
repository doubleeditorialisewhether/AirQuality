<?php

// Bindet das Skript 130_extract.php für Rohdaten ein
$data = include('extract.php');

// Initialisiert ein Array, um die transformierten Daten zu speichern
$transformedData = [];

// Transformiert und fügt die notwendigen Informationen hinzu
foreach ($data['results'] as $location) {
    foreach ($location['parameters'] as $parameter) { // Schleife für jeden Parameter
        $transformedData[] = [
            'city' => $location['city'],
            'parameter' => $parameter['parameter'],
            'average' => $parameter['average'],
            'lastValue' => $parameter['lastValue'],
            'unit' => $parameter['unit'],
            'lastUpdated' => $parameter['lastUpdated'],
        ];
    }
}

// Kodiert die transformierten Daten in JSON
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);

// Gibt die JSON-Daten aus, anstatt sie zurückzugeben
return $jsonData;

?>
