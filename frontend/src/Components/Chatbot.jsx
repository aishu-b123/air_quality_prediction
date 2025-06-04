import React, { useState } from "react";
import "./Chatbot.css";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = ({ fetchAQI, toggleChatbot }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newChatHistory = [...chatHistory, { sender: "user", text: userMessage }];
    setChatHistory(newChatHistory);
    setUserMessage("");

    try {
      const response = await fetch("https://air-quality-prediction-0k3d.onrender.com/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setChatHistory([...newChatHistory, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>AI Chatbot</h3>
        <button className="close-btn" onClick={toggleChatbot}>
          <FaTimes />
        </button>
      </div>

      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask me about air quality..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
