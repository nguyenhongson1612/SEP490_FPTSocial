import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizeAxios";

const ChatModal = ({
  open,
  onClose,
  username,
  messages,
  fullName,
  selectedChatId,
  fetchMessages,
}) => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);

  console.log('selectedChatId', selectedChatId)

  const handleSendMessage = async () => {
    try {
      let currentChatId = chatId;
  
        console.log("Creating new chat...");
        const createChatResponse = await authorizedAxiosInstance.post(
          `${API_ROOT}/api/Chat/createchatbox`,
          {
            otherId: username, // Use the selected username here
            title: "",
          }
        );
        console.log("Chat created:", createChatResponse.data.data);
        currentChatId = createChatResponse.data.data.chatId;
        setChatId(currentChatId);
      
  
      console.log("Current chatId:", currentChatId);
  
      const sessionKey = "oidc.user:https://feid.ptudev.net:societe-front-end";
      const sessionValue = sessionStorage.getItem(sessionKey);
      const profile = JSON.parse(sessionValue).profile;
  
      const config = {
        headers: {
          "Project-ID": "d7c4f700-4fc1-4f96-822d-8ffd0920b438",
          "User-Name": profile.userId,
          "User-Secret": profile.userId,
        },
      };
  
      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${currentChatId}/messages/`,
        {
          text: message,
        },
        config
      );
  
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6">{fullName}</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Box>
    </Modal>
  );
};

export default ChatModal;
