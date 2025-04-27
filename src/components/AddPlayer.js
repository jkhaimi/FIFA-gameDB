import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AddPlayer.css";
import { LuArrowLeft } from "react-icons/lu";
import StanleyCup from "../Images/Stanley_Cup.png";
import UCL from "../Images/UCL.webp";
import { useNavigate } from "react-router-dom";

const Notification = ({ message, type }) => {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

const AddPlayer = () => {
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate(); // Ota käyttöön navigointitoiminto
  const [playerData, setPlayerData] = useState({
    firstname: "",
    lastname: "",
    team: "",
    age: 0,
    height: "",
    weight: "",
    city: "",
    color: "",
  });
//   const [imageFile, setImageFile] = useState(null);

useEffect(() => {
  if (notification.message) {
    const timer = setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerData({ ...playerData, [name]: value });
  };

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!playerData.firstname || !playerData.lastname || !playerData.team || !playerData.age || !playerData.height || !playerData.weight || !playerData.city || !playerData.color) {
      setNotification({ message: "Kaikki kentät tulee täyttää!", type: "error" });
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`, {
        // const response = await fetch('/api/players', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData), // Lähetetään JSON-muotoisena
      });
  
      if (response.ok) {
        setNotification({ message: "Pelaaja lisätty onnistuneesti!", type: "success" });
        setPlayerData({
          firstname: "",
          lastname: "",
          team: "",
          age: 0,
          height: "",
          weight: "",
          city: "",
          color: "#000000",
        });
        navigate("/"); 
      } else {
        setNotification({ message: "Virhe pelaajan lisäämisessä!", type: "error" });
      }
    } catch (error) {
      console.error("Virhe POST-pyynnössä:", error);
      setNotification({ message: "Yhteys eoponnistui!", type: "error" });
    }
  };  

  return (
    <div className="add-player-container">
      {notification.message && <Notification message={notification.message} type={notification.type} />}
      <Link to="/" className="back-button">
        <LuArrowLeft />
      </Link>
      <div className="player-top">
        <img src={UCL} className="trophy" alt="Stanley Cup" />
        <p className="league-title">FIFA League of Champions</p>
        <p className="league-year">2025</p>
      </div>

      <form onSubmit={handleSubmit} className="add-player-form">
        <div className="add-player-row">
        <label>
          Etunimi
          <input
            type="text"
            name="firstname"
            value={playerData.firstname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Sukunimi
          <input
            type="text"
            name="lastname"
            value={playerData.lastname}
            onChange={handleChange}
            required
          />
        </label>
        </div>
        <div className="add-player-row">
        <label>
          Pituus (cm)
          <input
            type="text"
            name="height"
            value={playerData.height}
            onChange={handleChange}
          />
        </label>
        <label>
          Paino (kg)
          <input
            type="text"
            name="weight"
            value={playerData.weight}
            onChange={handleChange}
          />
        </label>
        </div>
        <div className="add-player-row">
        <label>
          Joukkue
          <input
            type="text"
            name="team"
            value={playerData.team}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Kaupunki
          <input
            type="text"
            name="city"
            value={playerData.city}
            onChange={handleChange}
          />
        </label>
        </div>
        <div className="add-player-row">
        <label>
          Ikä
          <input
            className="add-player-age"
            type="number"
            name="age"
            value={playerData.age}
            onChange={handleChange}
            required
          />
        </label>
        <label>
            Väri
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                type="color"
                name="color"
                value={playerData.color}
                onChange={handleChange}
                style={{ width: "50px", height: "30px", border: "none", padding: "0" }}
                />
                {/* Näytetään värin koodi */}
                <span style={{ fontSize: "16px", fontFamily: "monospace" }}>
                {playerData.color || "#000000"}
                </span>
            </div>
          </label>

        </div>
        {/* <label>
          Lataa kuva:
          <input type="file" accept="image/png" onChange={handleFileChange} required />
        </label> */}
      </form>
      <button className="add-player-button" onClick={handleSubmit}>Lisää pelaaja</button>
    </div>
  );
};

export default AddPlayer;
