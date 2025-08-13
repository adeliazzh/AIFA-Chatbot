import React, { useState, useEffect } from "react";
import { FaRegPaperPlane, FaImage, FaFilePdf } from "react-icons/fa6";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Markdown from "react-markdown";


const ChatWindow = ({ chatHistory, setChatHistory }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  // get the list from backend
  useEffect(() => {
  const fetchModels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/models");
      const models = await response.json();
      setAvailableModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0]); // default
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };
  fetchModels();
}, []);

  // send questions
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (prompt.trim() === "" || isLoading || !selectedModel) return;

    const userMessage = { role: "user", content: prompt };
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory);
    setPrompt("");
    setIsLoading(true);

    try {
      // Kirim chat ke server backend lokal
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan respons dari server.");
      }

      const data = await response.json();
      const botResponseText = data.response;

      const botMessage = { role: "assistant", content: botResponseText };
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: `Maaf, terjadi kesalahan: ${error.message}.`,
      };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // logic buat ngirim file nanti
  };

  // Komponen untuk menampilkan pesan dengan Markdown
  const Message = ({ content, role }) => {
    const rawMarkup = marked.parse(content);
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);

    return (
      <div
        className={`max-w-xl p-3 rounded-lg break-words whitespace-pre-wrap ${
          role === "user" ? "bg-blue-600" : "bg-gray-700"
        }`}
        dangerouslySetInnerHTML={{ __html: sanitizedMarkup }}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <div className="text-lg font-bold">Percakapan</div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-gray-700 text-white rounded-md px-2 py-1"
          disabled={isLoading}
        >
          {availableModels.length > 0 ? (
            availableModels.map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))
          ) : (
            <option>Loading models...</option>
          )}
        </select>
      </div>

      {/* Riwayat Chat */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold mb-2">Halo, Adelia</h1>
            <p className="text-gray-400">Mulai percakapan baru dengan AIFA.</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Message content={message.content} role={message.role} />
            </div>
          ))
        )}
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xl p-3 rounded-lg bg-gray-700 animate-pulse">
              <span>...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input dan Tombol Upload */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition"
          >
            <FaFilePdf className="text-lg" />
          </label>
          <input
            type="file"
            id="image-upload"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition"
          >
            <FaImage className="text-lg" />
          </label>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            disabled={isLoading || prompt.trim() === ""}
          >
            <FaRegPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;