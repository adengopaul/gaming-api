const fetch = require('node-fetch');

getLeagues = () => {
    setInterval(() => {
        fetch('https://api.betting-api.com/betway/football/line/leagues', {
            method: 'get',
            // body:    JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'f086646adaa14eea8220e19680ed6abc516d70b01576483a82940b40e421f54b'
            },
        })
            .then(res => res.json())
            .then(json => console.log(json));
    }, 10000);
}

// getLeagues();

