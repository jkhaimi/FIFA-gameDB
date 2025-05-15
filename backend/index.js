const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  // origin: ['https://nhl-score-db.vercel.app', 'http://localhost:3000'],
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

const gamesFilePath = "./games.json";
const playersFilePath = "./players.json";

fs.readFile(playersFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Tiedoston lukeminen epäonnistui:", err);
    return;
  }

  const players = JSON.parse(data || "[]");

  // Lisää ID:t, jotka alkavat 1:stä ja kasvavat yhdellä
  const updatedPlayers = players.map((player, index) => ({
    ...player,
    id: index + 1,
  }));

  fs.writeFile(playersFilePath, JSON.stringify(updatedPlayers, null, 2), (err) => {
    if (err) {
      console.error("Tiedoston tallentaminen epäonnistui:", err);
    } else {
      console.log("Pelaajien ID:t lisätty onnistuneesti!");
    }
  });
});

// ID

fs.readFile(gamesFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Tiedoston lukeminen epäonnistui:", err);
    return;
  }

  const games = JSON.parse(data || "[]");

  // Lisää ID:t, jotka alkavat 1:stä ja kasvavat yhdellä
  const updatedGames = games.map((game, index) => ({
    ...game,
    id: index + 1,
  }));

  fs.writeFile(gamesFilePath, JSON.stringify(updatedGames, null, 2), (err) => {
    if (err) {
      console.error("Tiedoston tallentaminen epäonnistui:", err);
    } else {
      console.log("Pelien ID:t lisätty onnistuneesti!");
    }
  });
});

// API: Hae kaikki tulokset
app.get("/api/games", (req, res) => {
  fs.readFile(gamesFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }
    const games = JSON.parse(data || "[]");
    res.json(games);
  });
});

// API: Lisää uusi tulos
app.post("/api/games", (req, res) => {
  const newGame = req.body;
  fs.readFile(gamesFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }
    const games = JSON.parse(data || "[]");
    games.push(newGame);

    fs.writeFile(gamesFilePath, JSON.stringify(games, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Tiedoston tallentaminen epäonnistui" });
      }
      res.status(201).json(newGame);
    });
  });
});

// API: Hae kaikki pelaajat
app.get("/api/players", (req, res) => {
  fs.readFile(playersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }
    const players = JSON.parse(data || "[]");
    res.json(players);
  });
});

// API: Lisää uusi pelaaja
app.post("/api/players", (req, res) => {
  fs.readFile(playersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }

    const players = JSON.parse(data || "[]");
    const maxId = players.reduce((max, player) => (player.id > max ? player.id : max), 0);
    const newPlayer = { ...req.body, id: maxId + 1};

    players.push(newPlayer);

    fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Tiedoston tallentaminen epäonnistui" });
      }
      res.status(201).json(newPlayer);
    })
  })
})

app.put("/api/players/:id", (req, res) => {
  const playerId = parseInt(req.params.id); // Muunnetaan ID numeroksi
  const updatedPlayer = req.body; // Päivitetyt tiedot

  fs.readFile(playersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }

    let players = JSON.parse(data || "[]");

    // Etsi pelaaja ID:n perusteella
    const playerIndex = players.findIndex((player) => player.id === playerId);

    if (playerIndex === -1) {
      return res.status(404).json({ error: "Pelaajaa ei löytynyt" });
    }

    // Päivitä pelaajan tiedot
    players[playerIndex] = { ...players[playerIndex], ...updatedPlayer };

    fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Tiedoston tallentaminen epäonnistui" });
      }
      res.status(200).json(players[playerIndex]);
    });
  });
});

// API: Poista pelaaja
app.delete("/api/players/:id", (req, res) => {
  const playerId = parseInt(req.params.id);

  fs.readFile(playersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }

    let players = JSON.parse(data || "[]");
    const playerIndex = players.findIndex((player) => player.id === playerId);

    if (playerIndex === -1) {
      return res.status(404).json({ error: "Pelaajaa ei löytynyt" });
    }

    players = players.filter((player) => player.id !== playerId);

    fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Tiedoston tallentaminen epäonnistui" });
      }
      res.status(200).json({ message: "Pelaaja poistettu onnistuneesti" });
    });
  });
});

// Käynnistä palvelin
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä osoitteessa portissa ${PORT}`);
});
