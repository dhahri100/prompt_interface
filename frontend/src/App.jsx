import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    setLoading(true);
    setResponse("");
    setDebugInfo("");

    try {
      const res = await fetch("http://localhost:5678/webhook-test/fe53aa6d-b6af-4060-877c-ef082e1532c7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      // Debug: Log the full response structure
      console.log("Full response from n8n:", data);
      setDebugInfo(JSON.stringify(data, null, 2));
      
      // Try to extract the output
      setResponse(data.output || "⚠️ Aucune réponse reçue.");
    } catch (error) {
      console.error("Erreur:", error);
      setResponse("❌ Erreur lors de l'envoi du prompt.");
      setDebugInfo(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>🧠 Prompt Box</h2>
      <textarea
        rows="5"
        cols="60"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Écris ton prompt ici..."
      />
      <br />
      <button onClick={sendPrompt} disabled={loading || !prompt.trim()}>
        {loading ? "⏳ Envoi..." : "Envoyer"}
      </button>

      <h3>📥 Réponse :</h3>
      <pre style={{ background: "#f4f4f4", padding: "1rem" }}>{response}</pre>

      <h3>🔍 Debug Info (Structure complète) :</h3>
      <pre style={{ background: "#e8f4f8", padding: "1rem", fontSize: "0.8em", maxHeight: "300px", overflow: "auto" }}>
        {debugInfo}
      </pre>
    </div>
  );
}

export default App;
