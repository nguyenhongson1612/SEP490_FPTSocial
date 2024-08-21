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
  useMediaQuery,
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
import ChatItem from './ChatItem';

function Sidebar({ onSelectChat, allMessages }) {
  const [searchResults, setSearchResults] = useState({
    listFriend: [],
    listUserNotFriend: [],
  });
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  console.log('🚀 ~ Sidebar ~ chats:', chats)
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
    setSelectedChatId(chatId)
    onSelectChat(chatId)
  };

  const handleUserSelect = (event) => {
    const userId = event.target.value;
    const user = allUsers.find((user) => user.id === userId);
    setSelectedUsername(user.username);
    setSelectedUserFullName(user.fullName);
    setCurrentSelectedUserId(userId);
    setModalOpen(true);
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
    <div
      className='h-[calc(100vh_-_55px)] w-[400px] flex-shrink-0 flex flex-col border-r-2'
    >
      <div className='p-2 flex flex-col h-full'>
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
            <ListItem
              {...props}
              key={option.friendId}
              onClick={(e) => {
                setModalOpen(true);
                setSelectedUsername(option.friendId);
                setSelectedUserFullName(option.friendName);
                setCurrentSelectedUserId(option.friendId);
              }}
            >
              <Avatar
                src={option.avata}
                alt={option.friendName}
                sx={{ marginRight: 1 }}
              />
              <ListItemText primary={option.friendName} />
            </ListItem>
          )}
          onBlur={() =>
            setSearchResults({ listFriend: [], listUserNotFriend: [] })
          }
          onChange={handleUserSelect}
        />

        <div className='flex-grow overflow-y-auto p-2 scrollbar-none-track'>
          <div className='h-full'>
            {!chats.length && selectedUsers.length === 0 ? (
              "No chats to display"
            ) : (
              <>
                {chats &&
                  chats.map((chat) => (
                    <ChatItem key={chat?.id} chat={chat} inPageChat handleSelectChat={handleSelectChat} />
                    // <ListItem
                    //   button
                    //   key={chat.id}
                    //   onClick={() => handleSelectChat(chat.id)}
                    //   selected={chat.id === selectedChatId}
                    // >
                    //   <Box sx={{ display: "flex", alignItems: "center" }}>
                    //     <Avatar
                    //       src={
                    //         chat?.people?.find(
                    //           (person) => person?.person?.username !== USER_ID
                    //         )?.person?.avatar
                    //       }
                    //       alt={chat.fullName}
                    //       sx={{ marginRight: 1 }}
                    //     />
                    //     <ListItemText
                    //       primary={chat?.people
                    //         .filter(
                    //           (person) => person.person.username !== USER_ID
                    //         )
                    //         .map(
                    //           (person) =>
                    //             `${person.person.first_name} ${person.person.last_name}`
                    //         )
                    //         .join(", ")}
                    //       secondary={
                    //         allMessages[chat.id]
                    //           ? allMessages[chat.id][
                    //             allMessages[chat.id].length - 1
                    //           ].text
                    //           : chat?.last_message?.text
                    //       }
                    //     />
                    //   </Box>
                    // </ListItem>
                  ))}
              </>
            )}
          </div>
        </div>


      </div>
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
    </div>
  );
}

export default Sidebar;
