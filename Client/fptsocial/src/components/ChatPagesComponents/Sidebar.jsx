import {
  Autocomplete,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import {
  API_ROOT,
  CHAT_ENGINE_CONFIG_HEADER,
  USER_ID,
} from "~/utils/constants";
import ChatModal from "./ChatModal";

function Sidebar({ onSelectChat, allMessages }) {
  const [searchResults, setSearchResults] = useState({
    listFriend: [],
    listUserNotFriend: [],
  });
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

  const handleSearch = async (searchText) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/api/Search/searchuserbyname?FindName=${encodeURIComponent(
          searchText
        )}`
      );
      if (response.data.statusCode === "Success") {
        setSearchResults(response.data.data);
      } else {
        setSearchResults({ listFriend: [], listUserNotFriend: [] });
      }
    } catch (error) {
      console.error("Error searching for users:", error);
      setSearchResults({ listFriend: [], listUserNotFriend: [] });
    }
  };

  const debouncedSearch = useCallback(
    debounce((searchText) => handleSearch(searchText), 1000),
    []
  );

  const flattenedOptions = [
    ...searchResults.listFriend.map((user) => ({ ...user, group: "Friends" })),
    ...searchResults.listUserNotFriend.map((user) => ({
      ...user,
      group: "Others",
    })),
  ];

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
        <Autocomplete
          options={flattenedOptions}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => option.friendName}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Users"
              onChange={(event) => {
                setSearch(event.target.value);
                debouncedSearch(event.target.value);
              }}
            />
          )}
          renderOption={(props, option) => (
            <ListItem {...props} key={option.friendId}>
              <Avatar
                src={option.avata}
                alt={option.friendName}
                sx={{ marginRight: 1 }}
              />
              <ListItemText primary={option.friendName} />
            </ListItem>
          )}
          onBlur={() => setSearchResults({ listFriend: [], listUserNotFriend: [] })}
          onChange={handleUserSelect}
        />
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          chat?.people?.find(
                            (person) => person?.person?.username !== USER_ID
                          )?.person?.avatar
                        }
                        alt={chat.fullName}
                        sx={{ marginRight: 1 }}
                      />
                      <ListItemText
                        primary={chat?.people
                          .filter(
                            (person) => person.person.username !== USER_ID
                          )
                          .map(
                            (person) =>
                              `${person.person.first_name} ${person.person.last_name}`
                          )
                          .join(", ")}
                        secondary={
                          allMessages[chat.id]
                            ? allMessages[chat.id][
                                allMessages[chat.id].length - 1
                              ].text
                            : chat?.last_message?.text
                        }
                      />
                    </Box>
                  </ListItem>
                ))}
            </>
          )}
        </List>
      </Box>
      <ChatModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        username={selectedUsername}
        fullName={selectedUserFullName}
        messages={modalMessages}
        setMessages={setModalMessages}
        selectedChatId={currentSelectedUserId}
        fetchChats={fetchChats}
      />
    </Drawer>
  );
}

export default Sidebar;
