document.addEventListener('DOMContentLoaded', function() {
    let url = 'https://191734-4.web.fhgr.ch/php/unload.php';
    let chart;

    async function fetchData(url) {
        try {
            let response = await fetch(url);
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    async function prepareData(days) {
        let rawData = await fetchData(url);
        let labels = [];
        let pm1Values = [];
        let pm25Values = [];
        let pm10Values = [];
        let humidityValues = [];
        let temperatureValues = [];
        let now = new Date();
        let startDate = new Date(now.setDate(now.getDate() - days));

        let allValues = []; // Sammeln aller Werte für die Bestimmung von Min und Max

        if (!rawData) {
            return null;
        }

        for (let timestamp in rawData) {
            let date = new Date(timestamp);
            if (date >= startDate) {
                labels.push(timestamp);
                let dataEntries = rawData[timestamp];
                pm1Values.push(dataEntries.reduce((acc, curr) => acc + curr.pm1_lastValue, 0) / dataEntries.length);
                pm25Values.push(dataEntries.reduce((acc, curr) => acc + curr.pm25_lastValue, 0) / dataEntries.length);
                pm10Values.push(dataEntries.reduce((acc, curr) => acc + curr.pm10_lastValue, 0) / dataEntries.length);
                humidityValues.push(dataEntries.reduce((acc, curr) => acc + curr.relativehumidity_lastValue, 0) / dataEntries.length);
                temperatureValues.push(dataEntries.reduce((acc, curr) => acc + curr.temperature_lastValue, 0) / dataEntries.length);
                
                allValues.push(...pm1Values, ...pm25Values, ...pm10Values, ...humidityValues, ...temperatureValues);
            }
        }

        let minValue = Math.min(...allValues);
        let maxValue = Math.max(...allValues);

        return { labels, pm1Values, pm25Values, pm10Values, humidityValues, temperatureValues, minValue, maxValue };
    }

    function addAnnotations(chartData) {
        const annotations = [];
        const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        let current = new Date(chartData.labels[0]).getTime();
        let startTime = current; // Speichern der Startzeit
    
        current += oneDay; // Beginnen mit dem Hinzufügen von Linien nach dem ersten Tag
    
        while (current <= new Date(chartData.labels[chartData.labels.length - 1]).getTime()) {
            if (current !== startTime) { // Überspringen der ersten Linie
                annotations.push({
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x',
                    value: new Date(current).toISOString(),
                    borderColor: 'rgba(255, 255, 255, 0.5)', // Weiß mit 50% Transparenz
                    borderWidth: 1.5, // Breite der Linie
                    borderDash: [10, 5] // Erzeugt gestrichelte Linien mit 10px Strich und 5px Lücke
                });
            }
            current += oneDay;
        }
    
        return annotations;
    }

    async function initChart(days = 1) {
        let chartData = await prepareData(days);
        if (!chartData) {
            console.error("Failed to load chart data.");
            return;
        }
    
        const ctx = document.querySelector('#airQuality').getContext('2d');
    
        // Zerstören des bestehenden Charts, falls vorhanden
        if (chart) {
            chart.destroy();
        }
    
        // Dynamisch das Aspect Ratio setzen
        let aspectRatio = window.innerWidth <= 720 ? 1 : 2; // 1:1 auf mobilen Geräten, 2:1 auf größeren Bildschirmen
    
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {label: 'PM1 in µg/m³', data: chartData.pm1Values, borderColor: '#F5586B', tension: 0.1, fill: false, pointStyle: 'circle'},
                    {label: 'PM2.5 in µg/m³', data: chartData.pm25Values, borderColor: '#E8AB73', tension: 0.1, fill: false, pointStyle: 'circle'},
                    {label: 'PM10 in µg/m³', data: chartData.pm10Values, borderColor: '#E8E373', tension: 0.1, fill: false, pointStyle: 'circle'},
                    {label: 'Relative Feuchtigkeit in %', data: chartData.humidityValues, borderColor: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.2)', tension: 0.1, fill: true, pointStyle: 'circle'},
                    {label: 'Temperatur in °C', data: chartData.temperatureValues, borderColor: '#A6A6A6', backgroundColor: 'rgba(166, 166, 166, 0.56)', tension: 0.1, fill: true, pointStyle: 'circle'}
                ]
            },
            options: {
                maintainAspectRatio: true,
                aspectRatio: aspectRatio, // Setzen des dynamischen Aspect Ratio
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            tooltipFormat: 'HH:mm',
                            displayFormats: {
                                hour: 'HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Zeitachse (Alte Daten → Neue Daten)',
                            color: '#FFFFFF'
                        }
                    },
                    y: {
                        suggestedMin: chartData.minValue - 10,
                        suggestedMax: chartData.maxValue + 10,
                        title: {
                            display: true,
                            text: 'Wert (Masseinheit beachten)',
                            color: '#FFFFFF'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true, // Verwenden Sie PointStyle für die Legendenmarkierungen
                            boxWidth: 10, // Sie können die Boxgröße anpassen
                            color: '#FFFFFF',
                        }
                    },
                    annotation: {
                        annotations: addAnnotations(chartData)
                    }
                }
            }
        });
    
        // Event Listener für die Größenänderung des Fensters hinzufügen
        window.addEventListener('resize', function() {
            updateChartAspectRatio();
        });
    
        // Initiale Aspect Ratio setzen
        updateChartAspectRatio();
    }
    
    
    
    function updateChartAspectRatio() {
        const aspectRatio = window.innerWidth <= 720 ? 1 : 2; // 1:1 auf mobilen Geräten, 2:1 auf größeren Bildschirmen
        chart.options.aspectRatio = aspectRatio;
        chart.resize();
    }
    
    function updateChart(days, element) {
        initChart(days).then(() => {
            // Reset the style of all buttons first
            document.querySelectorAll('.button-group button').forEach(btn => {
                btn.classList.remove('btn-light');
                btn.classList.add('btn-outline-light');
            });
    
            // Set the active button style
            element.classList.remove('btn-outline-light');
            element.classList.add('btn-light');
        });
    }
    
    document.getElementById('btn24h').addEventListener('click', function() {
        updateChart(1, this);
    });
    document.getElementById('btn3d').addEventListener('click', function() {
        updateChart(3, this);
    });
    document.getElementById('btn10d').addEventListener('click', function() {
        updateChart(10, this);
    });
    
    initChart(); // Initialize the chart with default value (last 24 hours)
});
