import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GameTable.css";

function GameTable({ players, games}) {
  const [filter, setFilter] = useState("all");

  const calculateStats = () => {
    const stats = players.map((player) => ({
      name: player.firstname,
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      winRatio: 0,
      winLoseRatio: 0,
    }));

    games.forEach((game) => {
      const player1Stats = stats.find((stat) => stat.name === game.player1);
      const player2Stats = stats.find((stat) => stat.name === game.player2);

    if (player1Stats && player2Stats) {
      if (game.player1Score > game.player2Score) {
        player1Stats.wins++;
        player2Stats.losses++;
      } else if (game.player2Score > game.player1Score) {
        player2Stats.wins++;
        player1Stats.losses++;
      }

      player1Stats.goalsFor += game.player1Score;
      player1Stats.goalsAgainst += game.player2Score;
      player1Stats.goalDifference = player1Stats.goalsFor - player1Stats.goalsAgainst;

      player1Stats.winRatio = (
        (player1Stats.wins / (player1Stats.wins + player1Stats.losses)) *
        100
      ).toFixed(1);

      player1Stats.winLoseRatio = (
        (player1Stats.wins / player1Stats.losses)
      ).toFixed(2);

      player2Stats.goalsFor += game.player2Score;
      player2Stats.goalsAgainst += game.player1Score;
      player2Stats.goalDifference = player2Stats.goalsFor - player2Stats.goalsAgainst;

      player2Stats.winRatio = (
        (player2Stats.wins / (player2Stats.wins + player2Stats.losses)) *
        100
      ).toFixed(1);

      player2Stats.winLoseRatio = (
        (player2Stats.wins / player2Stats.losses)
      ).toFixed(2);

      if (player1Stats.wins >= 1 && player1Stats.losses === 0) {
        player1Stats.winLoseRatio = player1Stats.wins;
      }
      if (player2Stats.wins >= 1 && player2Stats.losses === 0) {
        player2Stats.winLoseRatio = player2Stats.wins;
      }

      }});

    return stats;
  };

  const stats = calculateStats();

  const filteredStats = filter === "over10" ? stats.filter(stat => stat.wins + stat.losses > 10) : stats;

  return (
    <div className="game-table">

      <div className="gametable-filters">
        <button className={`gametable-filter ${filter === "all" ? "gametable-active" : ""}`} onClick={() => setFilter("all")}>Kaikki</button>
        <button className={`gametable-filter ${filter === "over10" ? "gametable-active" : ""}`} onClick={() => setFilter("over10")}>Yli 10 peliä</button>
      </div>

      <div className="mobile-table">
        <table>
          <thead>
            <tr>
              <th>•</th>
              <th>Pelaaja</th>
              <th>W</th>
              <th>L</th>
              <th>GD</th>
              <th>W/L ratio</th>
            </tr>
          </thead>
          <tbody>
            {filteredStats
              .sort((a, b) => Number(b.winRatio) - Number(a.winRatio))
              .map((stat, index) => (
                <tr className="mobile-row" key={stat.name}>
                  <td>{index + 1}.</td>
                  <td>
                    <Link style={{ color: "white", textDecoration: "none" }} to={`/player/${stat.name}`}>
                      <strong>{stat.name}</strong>
                    </Link>
                  </td>
                  <td>{stat.wins}</td>
                  <td>{stat.losses}</td>
                  <td>{stat.goalDifference}</td>
                  {/* <td><strong>{stat.winRatio}%</strong></td> */}
                  <td><strong>{stat.winLoseRatio}</strong></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameTable;