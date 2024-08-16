import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import {
  API_ROOT,
  USER_ID,
  CHAT_ENGINE_CONFIG_HEADER,
  CHAT_KEY
} from "~/utils/constants";
import { ChatEngineWrapper, Socket } from "react-chat-engine";

function ChatWindow({ selectedChatId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatBoxDetail(selectedChatId);
      fetchChatMessages(selectedChatId);
    }
  }, [selectedChatId]);

  const fetchChatBoxDetail = async (chatId) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/api/Chat/getchatdetailbyid?ChatId=${chatId}`
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `https://api.chatengine.io/chats/${chatId}/messages/`,
        CHAT_ENGINE_CONFIG_HEADER
      );
      // Assuming the response contains the messages
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${selectedChatId}/messages/`,
        {
          text: message,
        },
        CHAT_ENGINE_CONFIG_HEADER
      );
      setMessage("");
      fetchChatMessages(selectedChatId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
      />
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender_username === USER_ID
                    ? "flex-end"
                    : "flex-start",
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  padding: 1,
                  borderRadius: 2,
                  backgroundColor:
                    message.sender_username === USER_ID
                      ? "orange"
                      : "lightgray",
                  color:
                    message.sender_username === USER_ID ? "white" : "black",
                }}
              >
                <Typography variant="body1">
                  <strong>{message.sender_username}:</strong> {message.text}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No messages to display.</Typography>
        )}
      </Box>
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
    </ChatEngineWrapper>
  );
}

export default ChatWindow;
