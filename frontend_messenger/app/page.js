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
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-center font-bold uppercase text-white bg-green-500 p-3 rounded-md mb-4 shadow-md">
        WhatsApp Automation Tool
      </h1>

      <label className="block w-full p-6 mb-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-500 transition">
        {file ? file.name : "Choose a file"}
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      <textarea
        placeholder="Enter your message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="w-full h-28 p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full p-3 rounded-lg text-white font-semibold ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} transition`}
      >
        {loading ? "Sending..." : "Start Messaging"}
      </button>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg max-h-48 overflow-y-auto">
        <h3 className="font-semibold mb-2">Logs:</h3>
        {logs.map((log, i) => (
          <div key={i} className={log.includes("Error") ? "text-red-500" : "text-green-600"}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
