import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Toolbar, Box, List, ListItem, ListItemText, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Sidebar({ onSelectChat }) {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const sidebarWidth = isSmallScreen ? 200 : isMediumScreen ? 240 : 300;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('https://api.chatengine.io/chats/', {
          headers: {
            'Project-ID': 'd7c4f700-4fc1-4f96-822d-8ffd0920b438',
            'User-Name': 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d',
            'User-Secret': 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d'
          }
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', padding: 2 }}>
        <TextField
          label="Search Chats"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <List>
          {filteredChats.map((chat) => (
            <ListItem button key={chat.id} onClick={() => onSelectChat(chat.id)}>
              <ListItemText primary={chat.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;