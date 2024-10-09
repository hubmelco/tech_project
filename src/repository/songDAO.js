
let token;

async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
        },
      });
      const {access_token} = await response.json();
      return access_token;
}

async function getSong(title, artist, type, offset, retries = 0) {
    if (!token) {
        token = await getToken();
    }
    if (retries === 2) {
        // Recursive call stopper
        throw {status: 502, message: "Unable to search for songs"}
    }
    const q = buildQ(title, artist)
    const response = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}&market=US&offset=${offset}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    });
    if (response.error) {
        const {status} = response.error;
        if (status !== 401) {
            throw response.error;
        }
        // 401 means token expired so retry method after getting a new token
        token = await getToken();
        return await getSong(retries+1);
    }
    const {tracks} = await response.json();
    console.log("Next Paginated call", tracks.next);
    const filtered = tracks.items.map((item) => {
        return {
            spotifyId: item.id,
            name: item.name,
            link: item.external_urls.spotify,
            popularity: item.popularity,
            image: item.album.images[1].url,
            artist: {
                id: item.artists[0].id,
                name: item.artists[0].name
            }
        }
    });
    return filtered;
}

function buildQ(title, artist) {
    let q = "";
    if (title && !artist) {
        q = `track%3A${title}`;
    } else if (artist && !title) {
        q = `artist%3A${artist}`;
    } else {
        q = `track%3A${title}+artist%3A${artist}`
    }
    return q;
}

module.exports = {getSong};