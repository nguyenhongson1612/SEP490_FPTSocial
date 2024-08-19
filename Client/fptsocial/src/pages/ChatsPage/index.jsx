import {
  AppBar,
  Box,
  Toolbar,
  Typography
} from "@mui/material";
import { useState } from "react";
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import Sidebar from "~/components/ChatPagesComponents/Sidebar";

function ChatPages() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [allMessages, setAllMessages] = useState({});

  const handleNewMessage = (chatId, message) => {
    setAllMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), message],
    }));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        onSelectChat={setSelectedChatId}
        allMessages={allMessages}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Messenger
            </Typography>
          </Toolbar>
        </AppBar>
        {selectedChatId ? (
          <ChatWindow
            selectedChatId={selectedChatId}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Typography variant="h4" color="textSecondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default ChatPages;
