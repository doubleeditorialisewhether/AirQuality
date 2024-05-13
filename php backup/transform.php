<?php

// Bindet das Skript extract.php für Rohdaten ein
$data = include('extract.php');

// Initialisiert ein Array, um die transformierten Daten zu speichern
$transformedData = [];

// Definiert das Grenzdatum
$cutoffDate = '2024-03-30T19:00:00+00:00';

// Transformiert und fügt die notwendigen Informationen hinzu
foreach ($data['results'] as $location) {
    $city = $location['city'] ?? 'Unbekannt'; // Setzt 'Unbekannt' falls keine Stadt angegeben ist

    foreach ($location['parameters'] as $parameter) {
        // Überprüft, ob 'lastUpdated' neuer als das Grenzdatum ist und der Parameter nicht 'um003' ist
        if ($parameter['lastUpdated'] > $cutoffDate && $parameter['parameter'] !== 'um003') {
            // Erstellt ein Array für jeden Parameter mit relevanten Daten
            $transformedData[] = [
                'parameter' => $parameter['parameter'],
                'average' => $parameter['average'],
                'lastValue' => $parameter['lastValue'],
                'unit' => $parameter['unit'],
                'lastUpdated' => $parameter['lastUpdated'],
            ];
        }
    }
}

// Kodiert die transformierten Daten in JSON
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);
// Gibt die JSON-Daten aus
/*echo $jsonData;*/
return $jsonData;


?>

