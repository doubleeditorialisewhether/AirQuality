Kurzbeschrieb
Wir haben Luftdaten in Zürich Letzigrund über den Zeitraum des IM Projekts bis jetzt gemessen. Ziel war es, den Feinstaub zu messen und zu analysieren, wie es sich über die Zeit auch in Abhängigkeit von Temperatur und relativer Luftfeuchtigkeit entwickelt hat.

Learnings
•	Einsatz von AI: AI kann sehr sinnvoll zum Programmieren eingesetzt werden. Ein Grundverständnis wird jedoch benötigt.
•	Bootstrap: Bootstrap ist sehr geeignet für solche Projekte, da man wenig Zeit für CSS Formatierungen verliert.

Schwierigkeiten
Datenbankstruktur: Die Datenbank war zuerst falsch aufgebaut. Mithilfe von SQL und Chat GPT wurde die Datenbank in eine neue Form gebracht. Dazu haben wir die Datenbank gesichert und dann mit einem entsprechenden SQL Befehl, generiert durch ChatGPT, eine neue Tabelle in der richtigen Form generiert. Das load.php wurde dann auch angepasst, damit die neue Tabelle mit den richtigen Daten befüllt wird.

SQL Befehl: 
-- Tabelle erstellen, falls sie noch nicht existiert
CREATE TABLE IF NOT EXISTS `ConsolidatedAirQualityData` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `relativehumidity_lastValue` double DEFAULT NULL,
  `pm1_lastValue` double DEFAULT NULL,
  `temperature_lastValue` double DEFAULT NULL,
  `pm25_lastValue` double DEFAULT NULL,
  `pm10_lastValue` double DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten in die neue Tabelle einfügen
INSERT INTO `ConsolidatedAirQualityData` (
  `relativehumidity_lastValue`,
  `pm1_lastValue`,
  `temperature_lastValue`,
  `pm25_lastValue`,
  `pm10_lastValue`,
  `last_updated`
)
SELECT
  MAX(CASE WHEN parameter = 'relativehumidity' THEN lastValue END) AS relativehumidity_lastValue,
  MAX(CASE WHEN parameter = 'pm1' THEN lastValue END) AS pm1_lastValue,
  MAX(CASE WHEN parameter = 'temperature' THEN lastValue END) AS temperature_lastValue,
  MAX(CASE WHEN parameter = 'pm25' THEN lastValue END) AS pm25_lastValue,
  MAX(CASE WHEN parameter = 'pm10' THEN lastValue END) AS pm10_lastValue,
  lastUpdated
FROM AirQualityMeasurements
GROUP BY lastUpdated;

Chart Auswahl: 
Das Auswählen des richtigen Chart war nicht einfach. Wir mussten uns zuerst in die Thematik einlesen. Ebenso wollten wir alle Werte in einem Chart darstellen, was eine zustätzliche Herausforderung war.
Figma: Der Umgang mit Figma war neu und erforderte eine Umstellung.
API-Parameter: Die Auswahl der richtigen Parameter der API und deren korrekte Übertragung in die Datenbank war ebenfalls eine Herausforderung.
