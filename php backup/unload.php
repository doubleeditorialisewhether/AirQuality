<?php

// Datenbankkonfiguration einbinden
require_once 'config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query, um Daten basierend auf dem Standort auszuwählen, sortiert nach Zeitstempel
    // Verwende ein Fragezeichen (?) anstelle eines benannten Parameters
    $sql = "SELECT * FROM AirQualityMeasurements";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage mit der Standortvariablen aus, die in einem Array übergeben wird
    // Die Standortvariable ersetzt das erste Fragezeichen in der SQL-Anweisung
    $stmt->execute([]);

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Strukturiere die Daten nach dem Parameter
    $structuredData = [];
    foreach ($results as $row) {
        $parameter = $row['parameter'];
        unset($row['parameter']); // Entferne das parameter-Feld aus der Zeile
        $structuredData[$parameter][] = $row;
    }

    // Gibt die strukturierten Ergebnisse im JSON-Format zurück
    echo json_encode($structuredData);
} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}
