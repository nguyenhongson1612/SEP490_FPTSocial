
import {
  Modal
} from "@mui/material"
import { IconX } from "@tabler/icons-react"
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow"
import UserTitle from './UserTitle'

function PopupChat({ chatId, handleCloseModal, modalOpen, fetchChats, chats }) {
  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <div className='fixed bottom-4 right-4 bg-fbWhite shadow-lg  rounded-md w-[350px] h-[95%] overflow-y-auto no-scrollbar'>

        {chatId && (
          <ChatWindow
            handleCloseModal={handleCloseModal}
            chats={chats}
            chatId={chatId}
            onNewMessage={() => { }}
            fetchChats={fetchChats}
          />
        )}
      </div>
    </Modal>
  )
}

export default PopupChat
