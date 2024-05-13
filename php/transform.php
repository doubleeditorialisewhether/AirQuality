<?php

// Bindet das Skript extract.php für Rohdaten ein
$data = include('extract.php');

// Initialisiert ein leeres Array für die transformierten Daten
$transformedData = [];

// Definiert das Grenzdatum
$cutoffDate = '2024-03-30T19:00:00+00:00';

// Iteriere über die Daten und transformiere sie
foreach ($data['results'] as $location) {
    // Initialisiere Variablen für die einzelnen Werte
    $relativehumidity_lastValue = null;
    $pm1_lastValue = null;
    $temperature_lastValue = null;
    $pm25_lastValue = null;
    $pm10_lastValue = null;
    $last_updated = null;

    // Iteriere über die Parameter und fülle die entsprechenden Variablen
    foreach ($location['parameters'] as $parameter) {
        switch ($parameter['parameter']) {
            case 'relativehumidity':
                $relativehumidity_lastValue = $parameter['lastValue'];
                break;
            case 'pm1':
                $pm1_lastValue = $parameter['lastValue'];
                break;
            case 'temperature':
                $temperature_lastValue = $parameter['lastValue'];
                break;
            case 'pm25':
                $pm25_lastValue = $parameter['lastValue'];
                break;
            case 'pm10':
                $pm10_lastValue = $parameter['lastValue'];
                break;
        }
        // Setze last_updated auf den letzten aktualisierten Zeitstempel
        $last_updated = $parameter['lastUpdated'];
    }

    // Füge die transformierten Daten in das Array ein
    $transformedData[] = [
        'relativehumidity_lastValue' => $relativehumidity_lastValue,
        'pm1_lastValue' => $pm1_lastValue,
        'temperature_lastValue' => $temperature_lastValue,
        'pm25_lastValue' => $pm25_lastValue,
        'pm10_lastValue' => $pm10_lastValue,
        'last_updated' => $last_updated
    ];
}

// Gibt die transformierten Daten zurück
return $transformedData;
?>
