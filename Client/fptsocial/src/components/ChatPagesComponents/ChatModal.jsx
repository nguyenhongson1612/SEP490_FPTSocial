import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { API_ROOT, CHAT_ENGINE_CONFIG_HEADER, CHAT_KEY, USER_ID } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { ChatEngineWrapper, Socket } from "react-chat-engine";

const ChatModal = ({
  open,
  onClose,
  username,
  fullName,
  fetchChats,
}) => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);

  const handleSendMessage = async () => {
    try {
      let currentChatId = chatId;

      const createChatResponse = await authorizedAxiosInstance.post(
        `${API_ROOT}/api/Chat/createchatbox`,
        {
          otherId: username,
          title: "",
        }
      );
      console.log("Chat created:", createChatResponse.data.data);
      currentChatId = createChatResponse.data.data.chatId;
      setChatId(currentChatId);

      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${currentChatId}/messages/`,
        {
          text: message,
        },
        CHAT_ENGINE_CONFIG_HEADER
      );

      if (createChatResponse.data.data) {
        onClose();
        fetchChats();
      } else {
        console.error("Error sending message");
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessage = (chatId, message) => {
    fetchChats(); // Re-fetch chats when a new message is received
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
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onNewMessage={handleNewMessage}
      />
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
    </ChatEngineWrapper>
  );
};

export default ChatModal;