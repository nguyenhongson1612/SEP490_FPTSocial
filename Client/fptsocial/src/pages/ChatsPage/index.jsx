import { useState } from "react"
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import Sidebar from "~/components/ChatPagesComponents/Sidebar";
import UserTitle from '~/components/ChatPagesComponents/UserTitle';
import NavTopBar from '~/components/NavTopBar/NavTopBar';

function ChatPages() {
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [allMessages, setAllMessages] = useState({})

  const handleNewMessage = (chatId, message) => {
    setAllMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), message],
    }))
  }

  return (<>
    <NavTopBar />
    <div className='h-[calc(100vh_-_55px)] flex'>
      <Sidebar
        setSelectedChatId={setSelectedChatId}
        allMessages={allMessages}
      />
      <main className='grow flex flex-col h-full justify-between'
      >
        <div className='border-b shadow-m bg-orange-100 shadow-inner p-2'>
          {selectedChatId && <UserTitle inChatPage setSelectedChatId={setSelectedChatId} />}
        </div>
        {selectedChatId ? (
          <ChatWindow
            selectedChatId={selectedChatId}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className='flex justify-center items-center grow h-10'
          >
            <div >
              Select a chat to start messaging
            </div>
          </div>
        )}
      </main>
    </div>
  </>

  )
}

export default ChatPages
