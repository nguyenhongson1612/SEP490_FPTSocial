import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import Sidebar from "~/components/ChatPagesComponents/Sidebar";
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizeAxios";

function ChatPages() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async (chatId) => {
    try {
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Chat/getchatdetailbyid?ChatId=${chatId}`);
      setMessages(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (selectedChatId && message.trim()) {
      try {
        if (messages.length === 0) {
          await authorizedAxiosInstance.post(`${API_ROOT}/api/Chat/createchatbox`, {
            otherId: selectedChatId,
            title: ""
          });
        }

        setMessage("");
        fetchMessages(selectedChatId);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelectChat={setSelectedChatId} />
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
        <ChatWindow selectedChatId={selectedChatId} messages={messages} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 2,
            borderTop: "1px solid #ddd",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            sx={{ marginRight: 1 }}
          />
          <IconButton
            color="primary"
            sx={{ backgroundColor: "orange", color: "white" }}
            onClick={sendMessage}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}

export default ChatPages;