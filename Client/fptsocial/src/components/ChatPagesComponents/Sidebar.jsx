import React, { useState, useEffect } from "react";
import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  useMediaQuery,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { set } from "lodash";

function Sidebar({ onSelectChat }) {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentSelectedUserId, setCurrentSelectedUserId] = useState(null);

  const sidebarWidth = isSmallScreen ? 200 : isMediumScreen ? 240 : 300;

  //   useEffect(() => {
  //     const fetchChats = async () => {
  //       try {
  //         const response = await axios.get('https://api.chatengine.io/chats/', {
  //           headers: {
  //             'Project-ID': 'd7c4f700-4fc1-4f96-822d-8ffd0920b438',
  //             'User-Name': 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d',
  //             'User-Secret': 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d'
  //           }
  //         });
  //         setChats(response.data);
  //       } catch (error) {
  //         console.error('Error fetching chat list:', error);
  //       }
  //     };

  //     fetchChats();
  //   }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await authorizedAxiosInstance.get(
          `${API_ROOT}/api/Chat/searchinchat`
        );
        if (response.data.statusCode === "Success") {
          setAllUsers(response.data.data.otherUser);
        } else {
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Error fetching all users:", error);
        setAllUsers([]);
      }
    };

    fetchAllUsers();
  }, []);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    onSelectChat(chatId);
  };

  const handleUserSelect = (event) => {
    const userId = event.target.value;
    const user = allUsers.find((user) => user.id === userId);
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers.filter((u) => u.id !== userId),
      user,
    ]);
    setCurrentSelectedUserId(userId);
    onSelectChat(user.username);
  };

  console.log("chats", chats);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ padding: 2 }}>
        <Select
          labelId="user-select-label"
          displayEmpty
          fullWidth
          value={search}
          onChange={handleUserSelect}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              paddingY: "8px",
            },
          }}
        >
          <MenuItem value="" disabled>
            Search Users
          </MenuItem>
          {allUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Avatar
                src={user.avata}
                alt={user.fullName}
                sx={{ marginRight: 1 }}
              />
              {user.fullName}
            </MenuItem>
          ))}
        </Select>
        <List>
          {!chats.length && selectedUsers.length === 0 ? (
            "No chats to display"
          ) : (
            <>
              {selectedUsers.map((user) => (
                <ListItem
                  button
                  selected={user.id === currentSelectedUserId}
                  key={user.id}
                  onClick={() => {
                    setCurrentSelectedUserId(user.id);
                    onSelectChat(user.username);
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.fullName}
                    sx={{ marginRight: 1 }}
                  />
                  <ListItemText primary={user.fullName} />
                </ListItem>
              ))}
              {chats &&
                chats.map((chat) => (
                  <ListItem
                    button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    selected={chat.id === selectedChatId}
                  >
                    <ListItemText primary={chat.title} />
                  </ListItem>
                ))}
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
