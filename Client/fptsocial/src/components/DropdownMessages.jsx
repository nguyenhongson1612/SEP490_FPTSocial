import {
  Popover,
} from "@mui/material"
import { IconBrandMessenger } from "@tabler/icons-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { CHAT_ENGINE_CONFIG_HEADER, USER_ID } from "~/utils/constants"
import ChatItem from './ChatPagesComponents/ChatItem'
import PopupChat from './ChatPagesComponents/PopupChat'

function DropdownMessages() {
  const [chats, setChats] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchChats = async () => {
    try {
      const response = await authorizedAxiosInstance.get(
        "https://api.chatengine.io/chats/",
        CHAT_ENGINE_CONFIG_HEADER
      )
      setChats(response.data)
    } catch (error) {
      console.error("Error fetching chat list:", error)
    }
  }

  const handleListItemClick = (chatId) => {
    setSelectedChatId(chatId)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    console.log('vao');

    setModalOpen(false)
    setSelectedChatId(null)
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    fetchChats()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div className="relative inline-flex">
      <button
        className="flex items-center justify rounded-full"
        aria-haspopup="true"
        onClick={handleClick}
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
          className=" p-2 flex flex-col justify-between h-full"
        >
          <div className='py-2'>
            <h1 className='font-bold text-black text-lg'>Messenger</h1>
          </div>
          <div className="w-80 min-h-[200px] h-full max-h-[500px] overflow-y-auto flex flex-col scrollbar-none-track">
            {chats?.slice(0, 10).map((chat) => (
              <ChatItem key={chat?.id} chat={chat} setModalOpen={setModalOpen} handleListItemClick={handleListItemClick} />
            ))}
          </div>
          {
            chats && <div className='flex justify-center'>
              <Link to={'/chats-page'} className='p-2 font-semibold text-orangeFpt hover:text-orange-600 hover:scale-105'>View all</Link>
            </div>
          }
        </div>
      </Popover>

      <PopupChat chatId={selectedChatId} fetchChats={fetchChats} handleCloseModal={handleCloseModal} modalOpen={modalOpen} chats={chats} />
    </div>
  )
}

export default DropdownMessages
