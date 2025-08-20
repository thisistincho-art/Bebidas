// App.jsx
import React, { useState } from "react";

function App() {
  const [cafe, setCafe] = useState("");
  const [proporcion, setProporcion] = useState("");
  const [agua, setAgua] = useState(30); // ml
  const [leche, setLeche] = useState(150); // ml

  const cafes = ["Flat White", "Latte", "Capuchino", "Magic"];

  const handleSeleccion = (tipo) => {
    setCafe(tipo);
    switch (tipo) {
      case "Flat White":
        setProporcion(`${agua}ml café : ${leche}ml leche`);
        break;
      case "Latte":
        setProporcion(`${agua}ml café : 200ml leche`);
        break;
      case "Capuchino":
        setProporcion(`${agua}ml café : 100ml leche : espuma`);
        break;
      case "Magic":
        setProporcion(`${agua}ml café : 150ml leche : microespuma doble`);
        break;
      default:
        setProporcion("");
    }
  };

  return (
    <div style={{
      backgroundColor: "#111",
      color: "#eee",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2rem" }}>Barista Minimal ☕</h1>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {cafes.map((tipo) => (
          <button
            key={tipo}
            onClick={() => handleSeleccion(tipo)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#222",
              color: "#eee",
              border: "1px solid #555",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {tipo}
          </button>
        ))}
      </div>
      {cafe && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2>{cafe}</h2>
          <p>{proporcion}</p>
        </div>
      )}
      {cafe && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <label>
            Agua (ml):
            <input type="number" value={agua} onChange={(e) => setAgua(e.target.value)} style={{ marginLeft: "10px", width: "60px" }}/>
          </label>
          <label>
            Leche (ml):
            <input type="number" value={leche} onChange={(e) => setLeche(e.target.value)} style={{ marginLeft: "10px", width: "60px" }}/>
          </label>
          <button onClick={() => setProporcion(`${agua}ml café : ${leche}ml leche`)} style={{ padding: "8px 16px", backgroundColor: "#333", color: "#eee", borderRadius: "6px", border: "none", cursor: "pointer" }}>
            Actualizar Proporción
          </button>
        </div>
      )}
    </div>
  );
}

export default App;