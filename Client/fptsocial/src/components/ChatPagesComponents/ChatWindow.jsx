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
import UserAvatar from '../UI/UserAvatar';

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
      <div className='h-[450px] grow overflow-y-auto scrollbar-none-track p-3 bg-white' >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender_username === USER_ID ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div className={`flex flex-col flex-gap ${message.sender_username === USER_ID ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className='text-xs capitalize font-light'>{message?.sender.first_name}</div>
                <div className={`flex gap-1 w-full ${message.sender_username === USER_ID ? 'justify-end' : 'justify-start'}`}>
                  {message.sender_username !== USER_ID && <div className='relative min-w-8 h-fit'>
                    <UserAvatar
                      avatarSrc={message?.sender?.avatar}
                      size='2'
                    />
                    {
                      message?.sender?.is_online &&
                      <div className='absolute bottom-0 right-0 size-3 border-2 border-white rounded-full bg-green-500'></div>
                    }
                  </div>
                  }
                  <div className={`py-2 px-3 rounded-lg ${message.sender_username === USER_ID ? 'bg-orangeFpt text-white' : 'bg-gray-100'} 
                      shadow-lg`}
                  >
                    {message.text}
                  </div>
                </div>



              </div>
            </div>
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
            <Typography variant="h2" color="textSecondary">
              No messages to display.
            </Typography>
          </Box>
        )}
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderTop: "1px solid #ddd",
        }}
      >
        <TextField
          className="bg-white"
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage()
            }
          }}
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
          onClick={sendMessage}
        >
          <SendIcon className='text-orangeFpt' />
        </IconButton>
      </Box>
    </ChatEngineWrapper>
  );
}

export default ChatWindow;