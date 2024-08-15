import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT, CHAT_ENGINE_CONFIG_HEADER } from "~/utils/constants";
import ChatModal from "./ChatModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessages, setModalMessages] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUserFullName, setSelectedUserFullName] = useState("");

  const sidebarWidth = isSmallScreen ? 200 : isMediumScreen ? 240 : 300;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await authorizedAxiosInstance.get(
          "https://api.chatengine.io/chats/",
          CHAT_ENGINE_CONFIG_HEADER
        );
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChats();
  }, []);

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
    setSelectedUsername(user.username);
    setSelectedUserFullName(user.fullName);
    setCurrentSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMessages([]);
  };

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
              {chats &&
                chats.map((chat) => (
                  <ListItem
                    button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    selected={chat.id === selectedChatId}
                  >
                    <Avatar
                      src={chat.avatar}
                      alt={chat.fullName}
                      sx={{ marginRight: 1 }}
                    />
                    <ListItemText primary={chat.title} />
                  </ListItem>
                ))}
            </>
          )}
        </List>
      </Box>
      <ChatModal
        open={modalOpen}
        onClose={handleCloseModal}
        username={selectedUsername}
        fullName={selectedUserFullName}
        messages={modalMessages}
        setMessages={setModalMessages}
        selectedChatId={currentSelectedUserId}
      />
    </Drawer>
  );
}

export default Sidebar;
