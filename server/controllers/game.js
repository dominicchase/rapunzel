const axios = require("axios");
const qs = require("qs");

module.exports = {
  getGames,
  getGame,
};

let accessToken = null;
let tokenExpiry = null;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const fields = "name,genres.name,platforms.name,first_release_date,cover.url";

async function getGame(req, res) {
  try {
    const gameId = req.params.gameId;
    if (!gameId) {
      return res.status(400).json({ error: "gameId parameter is missing" });
    }

    await ensureTokenValid();

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id,
        Authorization: `Bearer ${accessToken}`,
      },
      body: `fields ${fields}; where id = ${gameId};`,
    });

    if (response.status === 200) {
      const data = await response.json();

      const filteredData = data
        .filter((datum) => "cover" in datum)
        .map((datum) => ({
          ...datum,
          cover: {
            id: datum.cover.id,
            url: datum.cover.url.replace("thumb", "cover_big"),
          },
        }));

      return res.send(filteredData);
    } else {
      throw new Error(`Failed to fetch game data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching game data: ${error}`);
  }
}

async function getGames(req, res) {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: "Search parameter is missing" });
    }

    await ensureTokenValid();

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id,
        Authorization: `Bearer ${accessToken}`,
      },
      body: `search "${search}"; fields ${fields};`,
    });

    if (response.status === 200) {
      const data = await response.json();

      const filteredData = data
        .filter((datum) => "cover" in datum)
        .map((datum) => ({
          ...datum,
          cover: {
            id: datum.cover.id,
            url: datum.cover.url.replace("thumb", "cover_big"),
          },
        }));

      return res.send(filteredData);
    } else {
      throw new Error(`Failed to fetch game data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching game data: ${error}`);
  }
}

// Function to get a new access token
async function getAccessToken() {
  const tokenUrl = "https://id.twitch.tv/oauth2/token";
  const payload = qs.stringify({
    client_id,
    client_secret,
    grant_type: "client_credentials",
  });

  try {
    const response = await axios.post(tokenUrl, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.status === 200) {
      accessToken = response.data.access_token;
      tokenExpiry = Date.now() + response.data.expires_in * 1000;
      console.log("Access token obtained:", accessToken);
    } else {
      throw new Error("Failed to get access token");
    }
  } catch (error) {
    console.error("Error getting access token:", error);
  }
}

// Ensure the token is valid, renew if necessary
async function ensureTokenValid() {
  if (!accessToken || Date.now() >= tokenExpiry) {
    await getAccessToken();
  }
}
