import React, { useState, useEffect } from "react";
import "./AddGame.css";

const Notification = ({ message, type }) => {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

function AddGame({ onGameAdd }) {
  const [players, setPlayers] = useState([]);
  const [player1, setplayer1] = useState("");
  const [player2, setplayer2] = useState("");
  const [player1Score, setplayer1Score] = useState("");
  const [player2Score, setplayer2Score] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  useEffect(() => {
    
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
        // const response = await fetch('/api/players');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Virhe pelaajien hakemisessa:", error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Varmista, että estät oletustoiminnon
    if (!player1 || !player2 || player1 === player2) {
      setNotification({ message: "Valitse eri pelaajat.", type: "error" });
      return;
    }
    if (player1Score === player2Score) {
      setNotification({ message: "Ei voi olla tasapeli", type: "error" });
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1) 
      .toString()
      .padStart(2, "0")}.${now.getFullYear()}`;

    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const game = {
      player1,
      player2,
      player1Score: Number(player1Score),
      player2Score: Number(player2Score),
      addedAt: `${formattedDate} ${formattedTime}`,
    };

    // Lähetä tiedot backendille
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/games`, {
        // const response = await fetch('/api/games', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
      });

      if (response.ok) {
        setNotification({ message: "Peli lisätty!", type: "success" });
        setplayer1("");
        setplayer2("");
        setplayer1Score("");
        setplayer2Score("");
      } else {
        setNotification({ message: "Virhe tallennuksessa!", type: "error" });
      }
    } catch (error) {
      setNotification({ message: "Virhe pelin tallennuksessa!", type: "error" });
      console.log(error)
      console.log(game)
      console.log(players)
    }
  };

  const handleScoreClick = (score, setter) => {
    setter(score);
  };

  return (
    <div className="add-game">
      {notification.message && <Notification message={notification.message} type={notification.type} />}
      <h2 className="add-game-title">Lisää peli</h2>
      <form onSubmit={handleSubmit} className="add-game-form">
        <div className="team-selection">
          <div className="team home-team">
            <label className="home-team-select" htmlFor="home-team-select">Pelaaja 1:</label>
            <select
              id="home-team-select"
              className="team-select"
              value={player1 || ""}
              onChange={(e) => setplayer1(e.target.value)}
            >
              <option className="team-select-menu" value="" disabled>
                Valitse pelaaja
              </option>
              {players.map((player) => (
                <option
                className="team-select-menu"
                  key={player.id}
                  value={player.firstname}
                  disabled={player2 === player.firstname}
                >
                  {player.firstname}
                </option>
              ))}
            </select>
            {player1 && <p className="selected-player">Valittu: {player1}</p>}
            {!player1 && <p className="selected-player">Valittu: -</p>}
          </div>

          <div className="team away-team">
            <label className="away-team-select" htmlFor="away-team-select">Pelaaja 2:</label>
            <select
              id="away-team-select"
              className="team-select"
              value={player2 || ""}
              onChange={(e) => setplayer2(e.target.value)}
            >
              <option value="" disabled>
                Valitse pelaaja
              </option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.firstname}
                  disabled={player1 === player.firstname}
                >
                  {player.firstname}
                </option>
              ))}
            </select>
            {player2 && <p className="selected-player">Valittu: {player2}</p>}
            {!player2 && <p className="selected-player">Valittu: -</p>}
          </div>
        </div>

        <div className="score-section">
          <div className="score-box">
            <label className="scorebox-header">
              {player1 ? `${player1}n` : "Pelaajan 1"} pisteet:
            </label>
            <div className="score-input">
              <div className="score-display">{player1Score || 0}</div>
              <div className="score-buttons">
              {numbers.map((number, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleScoreClick(number, setplayer1Score)}
                  className={number === 0 ? "zero-button" : ""}
                >
                  {number}
                </button>
              ))}
            </div>
            </div>
          </div>

          <span className="score-viiva">-</span>

          <div className="score-box">
            <label className="scorebox-header">
              {player2 ? `${player2}n` : "Pelaajan 2"} pisteet:
            </label>
            <div className="score-input">
              <div className="score-display">{player2Score || 0}</div>
              <div className="score-buttons">
              {numbers.map((number, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleScoreClick(number, setplayer2Score)}
                  className={number === 0 ? "zero-button" : ""}
                >
                  {number}
                </button>
              ))}
            </div>
            </div>
          </div>
        </div>

        <button type="submit" className="add-game-submit">
          Lisää peli
        </button>
      </form>
    </div>
  );
}

export default AddGame;
