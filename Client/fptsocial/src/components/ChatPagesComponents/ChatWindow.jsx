import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import {
  API_ROOT,
  USER_ID,
  CHAT_ENGINE_CONFIG_HEADER,
  CHAT_KEY,
} from "~/utils/constants";
import { ChatEngineWrapper, Socket } from "react-chat-engine";

function ChatWindow({ selectedChatId, onNewMessage, fetchChats }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatBoxDetail(selectedChatId);
      fetchChatMessages(selectedChatId);
    }
  }, [selectedChatId]);

  const fetchChatBoxDetail = async (chatId) => {
    try {
      await authorizedAxiosInstance.get(
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
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const requestBody = {
      text: message,
      attachment_urls: attachments.length > 0 ? attachments : undefined,
    };

    try {
      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${selectedChatId}/messages/`,
        requestBody,
        CHAT_ENGINE_CONFIG_HEADER
      );
      setMessage("");
      setAttachments([]);
      fetchChatMessages(selectedChatId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessage = (chatId, message) => {
    if (chatId === selectedChatId) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
    onNewMessage(chatId, message);
    fetchChats(); // Re-fetch chats when a new message is received
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    const attachmentUrls = files.map((file) => URL.createObjectURL(file));
    setAttachments(attachmentUrls);
  };

  return (
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onNewMessage={handleNewMessage}
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
                  <strong>{message?.sender.first_name + " " + message?.sender.last_name}:</strong> {message.text}
                </Typography>
              </Box>
            </Box>
          ))
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
              No messages to display.
            </Typography>
          </Box>
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
         {/* <input
          type="file"
          multiple
          onChange={handleAttachmentChange}
          style={{ display: "none" }}
          id="attachment-input"
        />
        <label htmlFor="attachment-input">
          <Button component="span" variant="contained" sx={{ marginRight: 1 }}>
            Attach
          </Button>
        </label> */}
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