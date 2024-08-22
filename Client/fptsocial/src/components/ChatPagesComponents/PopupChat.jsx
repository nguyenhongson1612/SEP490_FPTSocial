
import {
  Modal
} from "@mui/material"
import { IconX } from "@tabler/icons-react"
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow"
import UserTitle from './UserTitle'

function PopupChat({ selectedChatId, handleCloseModal, modalOpen, fetchChats }) {
  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <div className='fixed bottom-4 right-4 bg-fbWhite shadow-lg rounded-md w-[350px]'>
        <div className='h-14 border-b py-2 px-3 flex justify-between shadow-md'>
          {selectedChatId && <UserTitle />}
          <div className='flex gap-2 items-center'
          >
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
  )
}

export default PopupChat
