import { useState, useEffect, useRef } from "react"
import { Box, Typography, TextField, IconButton, Tooltip, Fab } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import {
  API_ROOT,
  USER_ID,
  CHAT_ENGINE_CONFIG_HEADER,
  CHAT_KEY,
} from "~/utils/constants"
import { ChatEngineWrapper, Socket } from "react-chat-engine"
import UserAvatar from '../UI/UserAvatar'
import { cleanAndParseHTML, formatDate } from '~/utils/formatters'
import TipTapMes from '../TitTap/TitTabMessage'

function ChatWindow({ selectedChatId, onNewMessage, fetchChats }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [attachments, setAttachments] = useState([])
  const [chatDetail, setChatDetail] = useState(null)
  const [titleUser, setTitleUser] = useState({})
  const [lastReadMessageId, setLastReadMessageId] = useState(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    chatDetail &&
      setTitleUser(chatDetail?.people?.find((person) => person.person.username !== USER_ID))
  }, [chatDetail])

  useEffect(() => {
    if (selectedChatId) {
      // fetchChatBoxDetail(selectedChatId)
      fetchChatMessages(selectedChatId)
    }
  }, [selectedChatId])

  useEffect(() => {
    if (messages.length > 0 && selectedChatId) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.id !== lastReadMessageId) {
        fetchCheckRead(selectedChatId, lastMessage.id)
        setLastReadMessageId(lastMessage.id)
      }
      scrollToBottom()
    }
  }, [messages, selectedChatId, lastReadMessageId])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const bottomThreshold = 100 // pixels from bottom
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > bottomThreshold)
  }

  const fetchCheckRead = async (chatId, messageId) => {
    try {
      await authorizedAxiosInstance.patch(
        `https://api.chatengine.io/chats/${chatId}/people/`,
        { last_read: messageId },
        CHAT_ENGINE_CONFIG_HEADER
      )
    } catch (error) {
      console.error("Error updating last read:", error)
    }
  }

  const fetchChatBoxDetail = async (chatId) => {
    try {
      await authorizedAxiosInstance.get(
        `${API_ROOT}/api/Chat/getchatdetailbyid?ChatId=${chatId}`
      )
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `https://api.chatengine.io/chats/${chatId}/messages/`,
        CHAT_ENGINE_CONFIG_HEADER
      )
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching chat messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() && attachments?.length == 0) return
    const requestBody = {
      text: message,
      attachment_urls: attachments.length > 0 ? attachments?.map(e => (e?.url)) : undefined,
    }

    try {
      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${selectedChatId}/messages/`,
        requestBody,
        CHAT_ENGINE_CONFIG_HEADER
      )
      setMessage("")
      setAttachments([])
      await fetchChatMessages(selectedChatId)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleNewMessage = (chatId, message) => {
    if (chatId === selectedChatId) {
      setMessages((prevMessages) => [...prevMessages, message])
    }
    onNewMessage(chatId, message)
    fetchChats()
  }

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files)
    const attachmentUrls = files.map((file) => URL.createObjectURL(file))
    setAttachments(attachmentUrls)
  }
  return (
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onEditChat={setChatDetail}
        onNewMessage={handleNewMessage}
      />
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className='h-[450px] grow overflow-y-auto scrollbar-none-track p-3 bg-white'
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Tooltip key={index} title={formatDate(message?.created)} placement={message.sender_username === USER_ID ? "bottom-end" : "bottom-start"}>
              <div
                className={`flex flex-col ${message.sender_username === USER_ID ? 'items-end' : 'items-start'} mb-2 cursor-pointer`}
              >
                <div className='text-xs capitalize font-light'>{message?.sender.first_name}</div>
                <div className={`flex gap-1 max-w-[70%] ${message.sender_username === USER_ID ? 'justify-end' : 'justify-start'}`}>
                  {message.sender_username !== USER_ID && <div className='relative min-w-8 h-fit'>
                    <UserAvatar
                      avatarSrc={message?.sender?.avatar}
                      size='2'
                    />
                    {
                      titleUser?.person?.is_online &&
                      <div className='absolute bottom-0 right-0 size-3 border-2 border-white rounded-full bg-green-500'></div>
                    }
                  </div>
                  }
                  <div className='flex flex-col gap-1'>
                    <div className={`flex ${message.sender_username === USER_ID ? 'justify-end' : 'justify-start'}`}>
                      {
                        message?.text?.length > 0 &&
                        <div className={`py-2 px-3 w-fit rounded-lg ${message.sender_username === USER_ID ? 'bg-orangeFpt text-white' : 'bg-gray-100'} 
                    shadow-lg`}>
                          {cleanAndParseHTML(message?.text)}
                        </div>
                      }
                    </div>
                    {message?.attachments?.length > 0 &&
                      <div className='grid grid-cols-2 gap-1'>
                        {message?.attachments?.map((file, i) => {
                          const fileExtension = file?.file?.toLowerCase()
                          const isImage = ['jpg', 'jpeg', 'png', 'gif'].some(type => fileExtension?.includes(type))
                          const isVideo = ['mp4', 'webm', 'ogg'].some(type => fileExtension?.includes(type))

                          return (
                            <div key={file?.id} className={`flex items-center bg-gray-100 ${message?.attachments?.length % 2 === 1 && i === 0 ? 'col-span-2' : 'col-span-1'}`}>
                              {isImage && <img src={file?.file} alt="Attachment" className='object-cover w-full' loading='lazy' />}
                              {isVideo && (
                                <video src={file?.file} controls className='object-cover w-full' loading='lazy' />
                              )}
                              {/* {!isImage && !isVideo && <a href={file?.file} download>Download File</a>} */}
                            </div>
                          );
                        })}
                      </div>}
                    <div className={`flex gap-1 w-full ${message.sender_username === USER_ID ? 'justify-start' : 'justify-end'}`}>
                      {
                        titleUser?.last_read == message?.id &&
                        <div className="">
                          <UserAvatar
                            avatarSrc={titleUser?.person?.avatar}
                            size='1'
                          />
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Tooltip>
          ))
        ) : (
          <div
            className='flex justify-center items-center grow'
          >
            <div className='text-gray-500/90'>
              No messages to display
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderTop: "1px solid #ddd",
        }}
      >
        <TextField
          className="bg-white"
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage()
            }
          }}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon className='text-orangeFpt' />
        </IconButton>
      </Box> */}
      <div className='flex justify-center p-2 border-t'>
        <TipTapMes listMedia={attachments} setListMedia={setAttachments} content={message} setContent={setMessage} sendMessage={sendMessage} />
      </div>

      {showScrollButton && (
        <Fab
          color="primary"
          size="small"
          onClick={scrollToBottom}
          sx={{ position: 'absolute', bottom: 100, right: 16 }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}
    </ChatEngineWrapper>
  )
}

export default ChatWindow