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

function ChatPages() {
  const [selectedChatId, setSelectedChatId] = useState(null);




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
        <ChatWindow selectedChatId={selectedChatId} />
       </Box>
    </div>
  );
}

export default ChatPages;