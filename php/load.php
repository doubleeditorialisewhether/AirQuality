<?php

// Transformations-Skript als 'transform.php' einbinden
$transformedData = include('transform.php');

require_once 'config.php'; // Bindet die Datenbankkonfiguration ein

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query mit Platzhaltern für das Einfügen von Daten
    $sql = "INSERT INTO AirQualityZurich (relativehumidity_lastValue, pm1_lastValue, temperature_lastValue, pm25_lastValue, pm10_lastValue, last_updated) VALUES (?, ?, ?, ?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($transformedData as $item) {
        $stmt->execute([
            $item['relativehumidity_lastValue'],
            $item['pm1_lastValue'],
            $item['temperature_lastValue'],
            $item['pm25_lastValue'],
            $item['pm10_lastValue'],
            $item['last_updated']
        ]);
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}
?>
