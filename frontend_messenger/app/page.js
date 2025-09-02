'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !message) return alert("Select a file and enter a message!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    try {
      const response = await axios.post("http://localhost:5000/send-whatsapp", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setLogs(prev => [...prev, response.data.status]);
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "Error sending message"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>WhatsApp Automation Tool</h1>
      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <textarea
        placeholder="Enter your message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ width: '100%', height: 100, marginBottom: 10 }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        {loading ? "Sending..." : "Start Messaging"}
      </button>
      <div style={{
        marginTop: 20,
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 5,
        maxHeight: 200,
        overflowY: 'auto'
      }}>
        <h3>Logs:</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.includes("Error") ? "red" : "green" }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
