import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  Box,
  Modal,
  IconButton,
  Typography,
  Popover,
} from "@mui/material";
import { IconArrowsMaximize, IconBrandMessenger, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { CHAT_ENGINE_CONFIG_HEADER, USER_ID } from "~/utils/constants";
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from '@mui/icons-material/Close';
import ChatItem from './ChatPagesComponents/ChatItem';
import UserAvatar from './UI/UserAvatar';
import { compareDateTime } from '~/utils/formatters';
import moment from 'moment';

function DropdownMessages() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chats, setChats] = useState([]);
  console.log('🚀 ~ DropdownMessages ~ chats:', chats)
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

  // useEffect(() => {
  //   const clickHandler = ({ target }) => {
  //     if (!dropdown.current) return;
  //     if (
  //       !dropdownOpen ||
  //       dropdown.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     setDropdownOpen(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });

  // useEffect(() => {
  //   const keyHandler = ({ keyCode }) => {
  //     if (!dropdownOpen || keyCode !== 27) return;
  //     setDropdownOpen(false);
  //   };
  //   document.addEventListener("keydown", keyHandler);
  //   return () => document.removeEventListener("keydown", keyHandler);
  // });

  // const handleIconClick = () => {
  //   setDropdownOpen(!dropdownOpen);
  //   if (!dropdownOpen) {
  //     fetchChats();
  //   }
  // };

  const handleListItemClick = (chatId) => {
    setSelectedChatId(chatId)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedChatId(null)
  }

  const handleExpandClick = () => {
    navigate("/chats-page");
  };

  const getSelectedUserName = () => {
    const selectedChat = chats.find((chat) => chat.id === selectedChatId)
    if (selectedChat) {
      const user = selectedChat.people.find(
        (person) => person.person.username !== USER_ID
      )
      return user
    }
    return ""
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchChats();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="flex items-center justify rounded-full"
        aria-haspopup="true"
        // onClick={handleIconClick}
        onClick={handleClick}
        aria-expanded={dropdownOpen}
      >
        <IconBrandMessenger className="size-10 p-1 text-orangeFpt rounded-full" />
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div
          className=" p-2"
        >
          <div className='py-2'>
            <h1 className='font-bold text-black text-lg'>Messenger</h1>
          </div>
          <div className="w-80 min-h-[200px] max-h-[500px] overflow-y-auto flex flex-col scrollbar-none-track">
            {chats?.slice(0, 10).map((chat) => (
              <ChatItem key={chat?.id} chat={chat} setModalOpen={setModalOpen} handleListItemClick={handleListItemClick} />
            ))}
            {
              chats?.length > 10 && <div className='flex justify-center'>
                <Link to={'/chats-page'} className='p-2 font-semibold text-orangeFpt hover:text-orange-600 hover:scale-105'>View all</Link>
              </div>
            }
          </div>
        </div>
      </Popover>

      {/* {dropdownOpen && (
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
      )} */}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div className='fixed bottom-4 right-4 bg-fbWhite shadow-lg rounded-md w-[350px]'>
          <div className='h-10 border-b py-2 px-3 flex justify-between shadow-md'>
            <div className='capitalize font-semibold '>
              {
                (() => {
                  const user = getSelectedUserName()
                  return (
                    <div className='flex gap-1'>
                      <UserAvatar avatarSrc={`${user?.person?.avatar}`} size='1.8' />
                      <div >
                        {`${user?.person?.first_name} ${user?.person?.last_name}`}
                        {/* {moment.unix(user?.person?.last_read)} */}
                      </div>
                    </div>
                  )
                })()
                // getSelectedUserName()?.person?.first_name

              }
            </div>
            <div className='flex gap-2'
            >
              <IconArrowsMaximize onClick={handleExpandClick} className='cursor-pointer hover:bg-fbWhite rounded-full' />
              <IconX onClick={handleCloseModal} className='cursor-pointer hover:bg-fbWhite rounded-full' />
            </div>

          </div>
          <div className='flex flex-col'>
            {selectedChatId && (
              <ChatWindow
                selectedChatId={selectedChatId}
                onNewMessage={() => { }}
                fetchChats={fetchChats}
              />
            )}
          </div>

        </div>
      </Modal>
    </div>
  );
}

export default DropdownMessages;
