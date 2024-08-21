import {
  AppBar,
  Box,
  Toolbar,
  Typography
} from "@mui/material";
import { useState } from "react";
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import Sidebar from "~/components/ChatPagesComponents/Sidebar";
import NavTopBar from '~/components/NavTopBar/NavTopBar';

function ChatPages() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [allMessages, setAllMessages] = useState({});

  const handleNewMessage = (chatId, message) => {
    setAllMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), message],
    }));
  };

  return (<>
    <NavTopBar />
    <div className='h-[calc(100vh_-_55px)] flex'>
      <Sidebar
        onSelectChat={setSelectedChatId}
        allMessages={allMessages}
      />
      <main className='grow flex flex-col h-full justify-between'
      >
        <div className='border-b-2 shadow-md bg-fbWhite-500'>
          <Toolbar>
            <div className='text-2xl font-bold '>
              Messenger
            </div>
          </Toolbar>
        </div>
        {selectedChatId ? (
          <ChatWindow
            selectedChatId={selectedChatId}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className='flex justify-center items-center grow h-10 bg-fbWhite'
          >
            <div >
              Select a chat to start messaging
            </div>
          </div>
        )}
      </main>
    </div>
  </>

  );
}

export default ChatPages;
