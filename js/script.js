let url = 'https://191734-4.web.fhgr.ch/php/unload.php';
let chart;

async function fetchData(url) {
    try {
        let response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
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
        }
    }

    return { labels, pm1Values, pm25Values, pm10Values, humidityValues, temperatureValues };
}

async function initChart() {
    let chartData = await prepareData(1); // Initial load for last 24 hours
    const ctx = document.querySelector('#airQuality').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {label: 'PM1 Werte', data: chartData.pm1Values, borderColor: '#60a2f7', tension: 0.1, fill: false},
                {label: 'PM2.5 Werte', data: chartData.pm25Values, borderColor: '#266dc9', tension: 0.1, fill: false},
                {label: 'PM10 Werte', data: chartData.pm10Values, borderColor: '#06308c', tension: 0.1, fill: false},
                {label: 'Relative Feuchtigkeit', data: chartData.humidityValues, borderColor: '#abecf5', backgroundColor: 'rgba(171, 236, 245, 0.5)', tension: 0.1, fill: true},
                {label: 'Temperatur', data: chartData.temperatureValues, borderColor: '#ffb554', backgroundColor: 'rgba(255, 181, 84, 0.5)', tension: 0.1, fill: true}
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {unit: 'hour', tooltipFormat: 'yyyy-MM-dd HH:mm'},
                    title: {display: true, text: 'Datum und Uhrzeit'}
                },
                y: {min: -30, max: 100, title: {display: true, text: 'Wert'}}
            }
        }
    });
}

async function updateChart(days) {
    let chartData = await prepareData(days);
    chart.data.labels = chartData.labels;
    chart.data.datasets.forEach((dataset, index) => {
        dataset.data = chartData[Object.keys(chartData)[index + 1]]; // Adjust data for each dataset based on order in prepareData
    });
    chart.update();
}

initChart();
