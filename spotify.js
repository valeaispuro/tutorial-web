const http = require('node:http');
const querystring = require('node:querystring');
const url = require('node:url');

const searchTrack = async (token, query) => {
    const endpointSearch = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
    const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
        const response = await fetch(endpointSearch, requestOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('No se encontró la canción:', error.message);
        throw error;
    }
};

const miFuncion = async (nombre) => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'grant_type=client_credentials&client_id=c4ff2d7214454c4292ecb7ecfaf3d83b&client_secret=0ce8ce5af8b843cab71ba3d84ba7a560'
        };

        const spotifyTokenResponse = await fetch("https://accounts.spotify.com/api/token", requestOptions);
        if (!spotifyTokenResponse.ok) {
            throw new Error('Failed to fetch token from Spotify API');
        }
        const spotifyTokenData = await spotifyTokenResponse.json();

        const trackData = await searchTrack(spotifyTokenData.access_token, nombre);

        const endpointAi = "https://api.openai.com/v1/chat/completions";
        const requestOptionsAi = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ "role": "user", "content": "Recomienda canciones similares a: " + nombre }]
            })
        };

        const openAiResponse = await fetch(endpointAi, requestOptionsAi);
        if (!openAiResponse.ok) {
            throw new Error('Error con OpenAI');
        }
        const openAiData = await openAiResponse.json();
        const recomendaciones = openAiData.choices[0].message.content;
        console.log(recomendaciones);

        return { trackData, recomendaciones };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const server = http.createServer(async function (sol, res) {
    const nombre = 'Cardigan Taylor Swift';
    try {
        const { recomendaciones } = await miFuncion(nombre);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(recomendaciones);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error: ' + error.message);
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Servidor escuchando');
});

/*const search_track= async(token, query)=> {
  const endpoint_search= `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
  const requestOptions2 = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
  };

  try {
      const response = await fetch(endpoint_search, requestOptions2);
      const data = await response.json();
      console.log(data);
      return data;
  } catch (error) {
      console.error('Error al buscar la canción:', error.message);
  }
};

const server = http.createServer(function(sol, res) {
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials&client_id=c4ff2d7214454c4292ecb7ecfaf3d83b&client_secret=0ce8ce5af8b843cab71ba3d84ba7a560'
  };

  const endpoint_spotify="https://accounts.spotify.com/api/token";

  fetch(endpoint_spotify, requestOptions)
      .then(response => response.json())
      .then(data => {
          const queryFromUser = 'Cruel Summer Tyalor Swift'; 
          search_track(data.access_token, queryFromUser)
              .then(result => {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(result));
              })
              .catch(error => {
                  console.error('Error al buscar la canción:', error.message);
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Error al buscar la canción');
              });
      })
      .catch(error => {
          console.error('Error al obtener el token:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error al obtener el token');
      });
});

server.listen(3000,'127.0.0.1', () => {
  console.log('Servidor escuchando ');
});*/