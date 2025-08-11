import React from "react";
import { FaPlus, FaRegMessage } from "react-icons/fa6";

const Sidebar = ({ onNewChat, archivedChats, currentChatId, loadChat }) => {
  return (
    <div className="hidden md:flex w-64 bg-gray-800 p-4 flex-col rounded-tr-xl rounded-br-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">AIFA</span>
        </div>
        <button
          onClick={onNewChat}
          className="p-2 rounded-full hover:bg-gray-700 transition"
        >
          <FaPlus />
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center space-x-2 w-full p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition mb-4"
      >
        <FaRegMessage />
        <span>Percakapan baru</span>
      </button>

      <div className="flex-grow overflow-y-auto">
        {/* Riwayat Percakapan */}
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Terbaru</h3>
        {archivedChats.map((chat) => (
          <a
            key={chat.id}
            href="#"
            onClick={() => loadChat(chat.id)}
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition ${
              chat.id === currentChatId ? "bg-gray-700" : ""
            }`}
          >
            {/* Tampilkan judul chat, bisa dari prompt pertama */}
            <span>
              {chat.history[0]?.content.substring(0, 30) ||
                "Percakapan Tanpa Judul"}
              ...
            </span>
          </a>
        ))}
      </div>

      {/* Bagian bawah, bisa untuk settings atau lainnya */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition"
        >
          <span>Pengaturan & Bantuan</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
