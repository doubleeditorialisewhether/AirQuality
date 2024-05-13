let url = 'https://191734-4.web.fhgr.ch/php/unload.php';
let data;

async function fetchData(url) {
  try {
      let response = await fetch(url);
      let data = await response.json();
      console.log("API Response:", data); // Loggt die Rohdaten
      return data;
  }
  catch (error) {
      console.log("Fehler beim Abrufen der Daten:", error);
      return {}; // Gibt ein leeres Objekt zurück, falls ein Fehler auftritt
  }
}

// Funktion, um Daten zu filtern, die in den letzten 30 Tagen aktualisiert wurden
function filterLast30Days(data) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 Tage zurück
  let filteredData = [];
  Object.values(data).forEach(entries => { // Durchläuft alle Parameter
      entries.forEach(item => {
          if (new Date(item.lastUpdated) >= thirtyDaysAgo) {
              filteredData.push(item);
          }
      });
  });
  console.log("Filtered Data:", filteredData); // Loggt die gefilterten Daten
  return filteredData;
}

async function init() {
  let rawData = await fetchData(url);
  if (Object.keys(rawData).length > 0) {
      data = filterLast30Days(rawData);
      if (data.length > 0) {
          updateChart(data);
      } else {
          console.log('Keine Daten der letzten 30 Tage vorhanden.');
      }
  } else {
      console.log('Keine Daten zum Anzeigen');
  }
}

init();

// Funktion zum Aktualisieren des Charts mit gefilterten Daten
function updateChart(filteredData) {
  const labels = filteredData.map(item => new Date(item.lastUpdated).toLocaleDateString()); // Erstellt Labels basierend auf 'lastUpdated'
  const values = filteredData.map(item => item.lastValue); // Nutzt 'lastValue' als Datenpunkte für das Chart

  const ctx = document.querySelector('#airQuality').getContext('2d');
  new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Gemessene Werte (lastValue)',
              data: values,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}
