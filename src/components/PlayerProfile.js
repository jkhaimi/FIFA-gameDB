import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PlayerProfile.css";
import { LuArrowLeft } from "react-icons/lu";
import defaultImage from "../Images/default.png";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import {Doughnut} from 'react-chartjs-2';


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

function PlayerProfile() {
  const { playerName } = useParams();
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Tiedot");
 
  
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPlayers = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
      // const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    }

    const fetchGames = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/games`);
      // const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);
    };

    fetchPlayers();
    fetchGames();
  }, []);

  const player = players.find((p) => p.firstname === playerName);

  if (!player) {
    return <div>Pelaajaa ei löytynyt.</div>;
  }

  const playerGames = games.filter(
    (game) =>
      game.player1 === playerName || game.player2 === playerName
  );

  const Tiedot = () => (
    <div>
      <div className="player-info">
        <div className="info-item">
          <p>Ikä</p>
          <p><strong>{player.age}</strong></p>
        </div>
        <div className="info-item">
          <p>Pituus</p>
          <p><strong>{player.height} cm</strong></p>
        </div>
        <div className="info-item">
          <p>Paino</p>
          <p><strong>{player.weight} kg</strong></p>
        </div>
        <div className="info-item">
          <p>Kaupunki</p>
          <p><strong>{player.city}</strong></p>
        </div>
      </div>

      <p className="games-played">Pelatut pelit</p>
      {playerGames.length > 0 ? (
        <div>
          <table className="player-games">
            <tbody>
              {(showAll ? playerGames.toReversed() : playerGames.slice(-5).toReversed()).map((game) => {
                const isWinner =
                  (game.player1 === playerName && game.player1Score > game.player2Score) ||
                  (game.player2 === playerName && game.player2Score > game.player1Score);

                return (
                  <tr key={game.id} className="game-row">
                    <td>
                      <div className="game-players">
                        <span>{game.player1}</span>
                        <span>{game.player2}</span>
                      </div>
                    </td>
                    <td>
                      <div className="game-result">
                        <span><strong>{game.player1Score}</strong></span>
                        <span><strong>{game.player2Score}</strong></span>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`result-line ${isWinner ? "win-line" : "loss-line"}`}
                      ></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {playerGames.length > 5 && !showAll && (
            <button className="show-all-button" onClick={() => setShowAll(true)}>
              Kaikki pelit
            </button>
          )}
          {playerGames.length > 5 && showAll && (
            <button className="hide-all-button" onClick={() => setShowAll(false)}>
              Piilota pelit
            </button>
          )}
        </div>
      ) : (
        <p>Pelaajalla ei ole vielä pelattuja pelejä.</p>
      )}
    </div>
  );

  const Tilastot = () => {
    
    const totalGames = playerGames.length;

    const wins = playerGames.filter((game) => {
      return (
        (game.player1 === playerName && game.player1Score > game.player2Score) ||
        (game.player2 === playerName && game.player2Score > game.player1Score)
      );
    }).length;

    const losses = playerGames.filter((game) => {
        return (
          (game.player1 === playerName && game.player1Score < game.player2Score) ||
          (game.player2 === playerName && game.player2Score < game.player1Score)
        );
      }).length;

    const winPercentage = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

    const goalsFor = playerGames.reduce((total, game) => {
      if (game.player1 === playerName) {
        return total + game.player1Score; 
      } else if (game.player2 === playerName) {
        return total + game.player2Score; 
      }
      return total;
    }, 0);

    const goalsAgainst = playerGames.reduce((total, game) => {
      if (game.player1 === playerName) {
        return total + game.player2Score; 
      } else if (game.player2 === playerName) {
        return total + game.player1Score;
      }
      return total;
    }, 0);


    const homeGames = playerGames.filter((game) => {
        return (
            (game.player1 === playerName)
        )
    }).length;

    const homeWins = playerGames.filter((game) => {
        return (
          (game.player1 === playerName && game.player1Score > game.player2Score)
        );
      }).length;

    const homeWinPrecentage = totalGames > 0 ? ((homeWins / homeGames) * 100).toFixed(1) : 0;


    const awayGames = playerGames.filter((game) => {
        return (
            (game.player2 === playerName)
        )
    }).length;

    const awayWins = playerGames.filter((game) => {
        return (
            (game.player2 === playerName && game.player2Score > game.player1Score)
        )
    }).length;

    const awayWinPrecentage = totalGames > 0 ? ((awayWins / awayGames) * 100).toFixed(1) : 0;

    const calculateWinningStreak = () => {
        let currentStreak = 0;
    
        playerGames.forEach((game) => {
          const isWin =
            (game.player1 === playerName && game.player1Score > game.player2Score) ||
            (game.player2 === playerName && game.player2Score > game.player1Score);
    
          if (isWin) {
            currentStreak++;
          } else {
            currentStreak = 0;
          }
        });
    
        return currentStreak;
      };

      const WinStreak = calculateWinningStreak();
    //   const winStreakPercentage = totalGames > 0 ? ((longestWinStreak / totalGames) * 100).toFixed(1) : 0;

      const winstreak = {
        labels: ["Voittoputki"],
        datasets: [{
            label: "Poll",
            data: [WinStreak, (10 - WinStreak)],
            backgroundColor: ["orange", "transparent"]
        }]
      }

    const voittoprosentti = {
        labels: ["Voitto %"],
        datasets: [{
            label: "Poll",
            data: [winPercentage, (100 - winPercentage)], // Käytä voittoprosenttia ja loput häviöille
            backgroundColor: ["green", "transparent"]
        }],
      }


    // const kotivoittoprosentti = {
    //     labels: ["Kotivoitto %"],
    //     datasets: [{
    //         label: "Poll",
    //         data: [homeWinPrecentage, (100 - homeWinPrecentage)],
    //         backgroundColor: ["purple", "transparent"]
    //     }]
    // }

    // const vierasvoittoprosentti = {
    //     labels: ["Vierasvoitto %"],
    //     datasets: [{
    //         label: "Poll",
    //         data: [awayWinPrecentage, (100 - awayWinPrecentage)],
    //         backgroundColor: ["lightblue", "transparent"]
    //     }]
    // }

    const options = {
    }

    return (
      <div className="player-stats">
        <div className="player-stats-box">
        <p className="games-played">Pelatut pelit: <strong>{totalGames}</strong></p>
        <div className="player-games-stats">
            <span>Voitot <strong>{wins}</strong></span>
            <span>Häviöt <strong>{losses}</strong></span>
            {/* <span>Kotipelit <strong>{homeGames}</strong></span>
            <span>Vieraspelit <strong>{awayGames}</strong></span> */}
            <span>Tehdyt maalit <strong>{goalsFor}</strong></span>
            <span>Päästetyt maalit <strong>{goalsAgainst}</strong></span>
            </div>
        </div>
        <span className="doughnut-1">{winPercentage}%</span>
        <span className="doughnut-2">{WinStreak}</span>
        {/* <span className="doughnut-3">{homeWinPrecentage}%</span>
        <span className="doughnut-4">{awayWinPrecentage}%</span> */}
        <div className="doughnuts">
            <div className="doughnut">
            <Doughnut
            data={voittoprosentti}
            options={options}
            />
        </div>
        <div className="doughnut">
            <Doughnut
            data={winstreak}
            options={options}
            />
        </div>
        {/* <div className="doughnut">
            <Doughnut
            data={kotivoittoprosentti}
            options={options}
            />
        </div>
        <div className="doughnut">
            <Doughnut
            data={vierasvoittoprosentti}
            options={options}
            />
        </div> */}
        </div>
      </div>
    );
  };

  return (
    <div className="player-profile">
      <Link to="/" className="back-button">
        <LuArrowLeft />
      </Link>
      <div className="player-top">
        <div className="player-name">
          <p>{player.firstname}</p>
          <p><strong>{player.lastname}</strong></p>
        </div>
        <div className="variviiva" style={{ backgroundColor: player.color }}>
          <span className="player-team">{player.team}</span>
        </div>
        <img src={player.image || defaultImage} alt={`${playerName}`} 
          className={`profile-image profile-image-${player.id} ${player.image ? "" : "default-image"}`} />
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "Tiedot" ? "active" : ""}`}
          onClick={() => setActiveTab("Tiedot")}
        >
          Tiedot
        </button>
        <button
          className={`tab ${activeTab === "Tilastot" ? "active" : ""}`}
          onClick={() => setActiveTab("Tilastot")}
        >
          Tilastot
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "Tiedot" && <Tiedot />}
        {activeTab === "Tilastot" && <Tilastot />}
      </div>
    </div>
  );
}

export default PlayerProfile;