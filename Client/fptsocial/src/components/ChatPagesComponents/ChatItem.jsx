import { useRef, useState } from 'react';
import { Avatar } from 'react-chat-engine';
import { useNavigate } from 'react-router-dom';
import { CHAT_ENGINE_CONFIG_HEADER, USER_ID } from "~/utils/constants";
import UserAvatar from '../UI/UserAvatar';
import { compareDateTime } from '~/utils/formatters';

function ChatItem({ chat, setModalOpen, handleListItemClick, handleSelectChat, inPageChat = false }) {
  console.log('🚀 ~ ChatItem ~ chat:', chat)
  const members = chat?.people

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chats, setChats] = useState([]);
  console.log('🚀 ~ DropdownMessages ~ chats:', chats)
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();


  const handleExpandClick = () => {
    navigate("/chats-page");
  };

  // const getSelectedUserName = () => {
  //   const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  //   if (selectedChat) {
  //     const user = selectedChat.people.find(
  //       (person) => person.person.username !== USER_ID
  //     );
  //     return `${user.person.first_name} ${user.person.last_name}`;
  //   }
  //   return "";
  // };


  return <div
    className='p-2 hover:bg-fbWhite rounded-md cursor-pointer'
    key={chat?.id}
    onClick={() => (inPageChat ? handleSelectChat(chat?.id) : handleListItemClick(chat?.id))}
  >
    <div className='flex gap-2'>
      <div className='relative w-12'>
        <UserAvatar
          avatarSrc={
            members?.find(
              (person) => person?.person?.username !== USER_ID
            )?.person?.avatar
          }
          alt={chat?.fullName}
          sx={{ marginRight: 1 }}
        />
        {
          members?.some(mem => mem?.person?.is_online) && <div className='absolute bottom-0 right-0 size-3 border-2 border-white rounded-full bg-green-500'></div>
        }
      </div>

      <div className='flex flex-col w-full'>
        <div className='flex flex-col'>
          <h3 className="font-semibold capitalize">
            {chat?.title}
          </h3>
          <div className='text-xs flex justify-between'>
            <div className='text-xs flex gap-1'>
              <p className='font-semibold capitalize'>
                {chat?.last_message?.sender?.username == USER_ID ? 'You' : `${chat?.last_message?.sender?.first_name}`}:
              </p>
              <p className="text-gray-500/90 w-24  truncate">
                {chat?.last_message?.text}
              </p>
            </div>
            <p className='text-gray-500/90'>
              {compareDateTime(chat?.last_message?.created)}
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
}

export default ChatItem;
