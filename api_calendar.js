const key = '4xBTl8OIUlfgOlUBaaLOxtMPHF3s4Bmq';
const endpoint = `https://calendarific.com/api/v2/holidays?api_key=${key}&country=US&year=2022`;

fetch(endpoint)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.response.holidays);
    })
    .catch(error => {
        console.error('Error:', error);
    });
