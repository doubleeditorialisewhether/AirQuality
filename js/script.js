let url = 'https://191734-3.web.fhgr.ch/php/unload.php';
let data;

async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    catch (error) {
         console.log(error);
     }
}

//Alle Daten in eine Variable speichern
async function init(){
    let response = await fetch(url);
    data = await response.json();   
    console.log(data);
}

init();

//Chart JS einbinden

const airQuality = document.querySelector('#airQuality');

  new Chart(airQuality, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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