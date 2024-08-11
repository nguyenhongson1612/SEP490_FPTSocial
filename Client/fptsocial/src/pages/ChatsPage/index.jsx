import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import Sidebar from '~/components/ChatPagesComponents/Sidebar';
import ChatWindow from '~/components/ChatPagesComponents/ChatWindow';

const USER_NAME = 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d';
const USER_SECRET = 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d';
const PROJECT_ID = 'd7c4f700-4fc1-4f96-822d-8ffd0920b438';

function ChatPages() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `https://api.chatengine.io/chats/${chatId}/messages/`,
        {
          headers: {
            'Project-ID': PROJECT_ID,
            'User-Name': USER_NAME,
            'User-Secret': USER_SECRET,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (selectedChatId && message.trim()) {
      try {
        await axios.post(
          `https://api.chatengine.io/chats/${selectedChatId}/messages/`,
          { text: message },
          {
            headers: {
              'Project-ID': PROJECT_ID,
              'User-Name': USER_NAME,
              'User-Secret': USER_SECRET,
            },
          }
        );
        setMessage(''); // Clear the input field after sending the message
        fetchMessages(selectedChatId); // Fetch the latest messages
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onSelectChat={setSelectedChatId} />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            borderTop: '1px solid #ddd',
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            sx={{ marginRight: 1 }}
          />
          <IconButton
            color="primary"
            sx={{ backgroundColor: 'orange', color: 'white' }}
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