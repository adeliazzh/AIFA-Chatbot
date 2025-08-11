// src/App.jsx
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  // State untuk melacak chat yang sedang aktif
  const [currentChatId, setCurrentChatId] = useState(null);
  
  // State untuk menyimpan riwayat chat dari chat yang sedang aktif
  const [chatHistory, setChatHistory] = useState([]);
  
  // State untuk menyimpan semua riwayat percakapan yang diarsipkan
  const [archivedChats, setArchivedChats] = useState([]);

  // Fungsi untuk memulai percakapan baru
  const handleNewChat = () => {
    // Jika ada chat yang sedang aktif, arsipkan dulu
    if (chatHistory.length > 0) {
      setArchivedChats((prev) => [...prev, { id: currentChatId, history: chatHistory }]);
    }
    // Atur chat baru sebagai chat aktif
    setCurrentChatId(Date.now());
    setChatHistory([]);
  };

  // Fungsi untuk memuat riwayat chat yang diarsipkan
  const loadChat = (chatId) => {
    const chatToLoad = archivedChats.find(chat => chat.id === chatId);
    if (chatToLoad) {
      setChatHistory(chatToLoad.history);
      setCurrentChatId(chatId);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white font-inter">
      <Sidebar 
        onNewChat={handleNewChat} 
        archivedChats={archivedChats}
        currentChatId={currentChatId}
        loadChat={loadChat}
      />
      <ChatWindow 
        chatHistory={chatHistory} 
        setChatHistory={setChatHistory}
      />
    </div>
  );
}

export default App;
