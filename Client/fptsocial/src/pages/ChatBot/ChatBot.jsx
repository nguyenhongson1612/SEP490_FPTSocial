import React, { useState, useEffect, useRef } from 'react'
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"
import parts from '~/utils/gemini'
import { cloneDeep } from 'lodash'
import { cleanAndParseHTML } from '~/utils/formatters'
import NavTopBar from '~/components/NavTopBar/NavTopBar'

const apiKey = 'AIzaSyBbSebF0FCA4m_FobxREmtTx0br6meP4lI'
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
}


const ChatBox = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])
  function convertToHtml(text) {
    // Thay thế các ký tự xuống dòng bằng thẻ <br>
    let html = text.replace(/\n/g, '<br>');

    // Chuyển đổi tiêu đề
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');

    // Chuyển đổi in đậm
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Chuyển đổi danh sách không có thứ tự
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/<li>(.|\n)*?(<h|$)/g, '<ul>$&</ul>$2');

    // Loại bỏ các thẻ <ul> rỗng
    html = html.replace(/<ul><\/ul>/g, '');

    // Bọc các đoạn văn còn lại trong thẻ <p>
    html = html.replace(/>([^<]+)(?=<(?!\/li|\/ul|\/h))/g, '><p>$1</p>');

    return html;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    console.log('🚀 ~ handleSubmit ~ input:', input)

    parts.push({ text: `input: ${input}` })
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: parts }],
        generationConfig,
      })

      const botResponse = convertToHtml(result.response.text());
      parts.push({ text: `output: ${botResponse}` });
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <NavTopBar />
      <div className="h-[calc(100vh_-_55px)] flex flex-col bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className=" flex-1 overflow-y-auto scrollbar-none-track p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-md ${message.role === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white text-gray-800'
                }`}>
                <p className="text-sm md:text-base">{cleanAndParseHTML(message.content)}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md p-4 rounded-2xl bg-gray-200 shadow-md animate-pulse">
                <p className="text-sm md:text-base text-gray-600">Đang nhập...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 shadow-md">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Gửi'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ChatBox