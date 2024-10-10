
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

async function getSong(query, type, offset, retries = 0) {
    if (!token) {
        token = await getToken();
    }
    if (retries === 2) {
        // Recursive call stopper
        throw {status: 502, message: "Unable to search"}
    }
    
    let q = new buildQ();
    for (const key in query) {
        q.addQuery(key, query[key]);
    }
    q = q.build();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}&market=US&offset=${offset}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    });
    const json = await response.json();
    if (json.error) {
        const {status} = json.error;
        if (status !== 401) {
            throw json.error;
        }
        // 401 means token expired so retry method after getting a new token
        token = await getToken();
        return await getSong(retries+1);
    }
    const {tracks} = json;
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
    // const previous = constructNextPageURL(query, offset, type); 
    // Can maybe return above line to go back to previous search, 
    // maybe check if offset > limit before having this to ensure there is a previous
    const total = tracks.total - offset;
    offset = tracks.next ? offset + (total - (total - tracks.limit)) : null;
    const next = constructNextPageURL(query, offset, type);
    return {showMore: next, songs: filtered};
}

function constructNextPageURL(query, offset, type) {
    if (offset === null) {
        return "";
    }
    let url = `http://localhost:3000/songs?type=${type}`;
    for (const key in query) {
        if (query[key] !== undefined) {
            url += `&${key}=${query[key]}`;
        }
    }
    url+=`offset=${offset}`;
    return url;
}

class buildQ {
    constructor() {
        this.q = "";
    }

    addQuery(key, value) {
        if (value !== undefined) {
            if (this.q) {
                this.q += `+${key}%3A${value}`;
            } else {
                this.q += `${key}%3A${value}`
            }
        }
        return this;
    }

    build() {
        console.log(this.q);
        return this.q;
    }
}

module.exports = {getSong};