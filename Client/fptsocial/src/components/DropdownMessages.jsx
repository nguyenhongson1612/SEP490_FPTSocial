import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  Box,
  Modal,
  IconButton,
  Typography,
} from "@mui/material";
import { IconBrandMessenger } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { CHAT_ENGINE_CONFIG_HEADER, USER_ID } from "~/utils/constants";
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from '@mui/icons-material/Close';

function DropdownMessages() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleIconClick = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      fetchChats();
    }
  };

  const handleListItemClick = (chatId) => {
    setSelectedChatId(chatId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedChatId(null);
  };

  const handleExpandClick = () => {
    navigate("/chats-page");
  };

  const getSelectedUserName = () => {
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    if (selectedChat) {
      const user = selectedChat.people.find(
        (person) => person.person.username !== USER_ID
      );
      return `${user.person.first_name} ${user.person.last_name}`;
    }
    return "";
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="flex items-center justify rounded-full"
        aria-haspopup="true"
        onClick={handleIconClick}
        aria-expanded={dropdownOpen}
      >
        <IconBrandMessenger className="size-10 p-1 text-orangeFpt rounded-full" />
      </button>
      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-12 w-56 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <List sx={{ height: "300px", overflowY: "auto" }}>
            {chats.map((chat) => (
              <ListItem
                button
                key={chat.id}
                onClick={() => handleListItemClick(chat.id)}
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
                      .filter((person) => person.person.username !== USER_ID)
                      .map(
                        (person) =>
                          `${person.person.first_name} ${person.person.last_name}`
                      )
                      .join(", ")}
                    secondary={chat?.last_message?.text}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </div>
      )}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle }}>
          <Typography
            variant="h6"
            sx={{ position: "absolute", top: 12, left: 12 }}
          >
            {getSelectedUserName()}
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 48 }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleExpandClick}
          >
            <OpenInFullIcon />
          </IconButton>
          {selectedChatId && (
            <ChatWindow
              selectedChatId={selectedChatId}
              onNewMessage={() => {}}
              fetchChats={fetchChats}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  transform: "none",
  width: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default DropdownMessages;
