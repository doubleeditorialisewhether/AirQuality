<?php

// Datenbankkonfiguration einbinden
require_once 'config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');

// CORS-Header setzen, um Cross-Origin Requests zu erlauben
header('Access-Control-Allow-Origin: *'); // Erlaubt allen Domains den Zugriff
header('Access-Control-Allow-Methods: GET, POST'); // Erlaubt nur GET- und POST-Requests
header('Access-Control-Allow-Headers: Content-Type'); // Erlaubt nur Content-Type-Header

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query, um Daten aus der Tabelle AirQualityZurich zu selektieren
    $sql = "SELECT * FROM AirQualityZurich";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage aus
    $stmt->execute();

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Strukturiere die Daten nach dem Zeitstempel
    $structuredData = [];
    foreach ($results as $row) {
        $lastUpdated = $row['last_updated'];
        unset($row['last_updated']); // Entferne das last_updated-Feld aus der Zeile
        $structuredData[$lastUpdated][] = $row;
    }

    // Sicherstellen, dass jeder Zeitstempel ein Array enthält, auch wenn er nur einen Datensatz hat
    foreach ($structuredData as &$data) {
        if (!is_array($data)) {
            $data = [$data];
        }
    }
    unset($data); // Unset the reference to avoid potential side effects

    // Gibt die strukturierten Ergebnisse im JSON-Format zurück
    echo json_encode($structuredData);
} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}
