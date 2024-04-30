<?php

function fetchAirData() {
    //Variable definieren mit $
    $url = "https://api.openaq.org/v2/locations/7706";

    // API Key - Replace 'YOUR_API_KEY_HERE' with your actual API key
    $apiKey = '00014d59177f3509bed1d271073c7d84b242745a430a4dd21bab697700cb4b91';

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Set HTTP Header for Authentication
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . $apiKey
    ));

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    //return json_decode($response, true);
    return json_decode($response, true);
}

// Gibt die Daten zurück, wenn dieses Skript eingebunden ist
return fetchAirData();
?>