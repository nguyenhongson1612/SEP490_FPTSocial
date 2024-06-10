// 'use client'
import { FaBold, FaItalic, FaRedo, FaQuoteRight, FaUndo, FaUnderline, FaImage } from 'react-icons/fa'
import { AiOutlineEnter } from 'react-icons/ai'
import { MdFormatListBulleted, MdOutlineStrikethroughS } from 'react-icons/md'
import { VscListOrdered } from 'react-icons/vsc'
import { useRef } from 'react'


const Toolbar = ({ editor }) => {
  const fileInputRef = useRef(null)
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run()
      }
      reader.readAsDataURL(file)
    }
  }

  if (!editor) {
    return null
  }
  return (
    <div
      className="px-4 py-2 rounded-md flex  w-ful bg-fbWhite"
    >
      <div className='flex justify-start items-center gap-3 w-full lg:w-10/12 flex-wrap '>
        <button
          type="button"
          onClick={() => {

            editor.chain().focus().toggleBold().run()
          }}
          className={
            editor.isActive('bold')
              ? 'text-orangeFpt'
              : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <FaBold className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => {

            editor.chain().focus().toggleItalic().run()
          }}
          className={
            editor.isActive('italic')
              ? 'text-orangeFpt'
              : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <FaItalic className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike')
            ? 'text-orangeFpt'
            : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <MdOutlineStrikethroughS className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => {

            editor.chain().focus().toggleUnderline().run()
          }}
          className={
            editor.isActive('underline')
              ? 'text-orangeFpt'
              : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <FaUnderline className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList')
            ? 'text-orangeFpt'
            : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <MdFormatListBulleted className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => {

            editor.chain().focus().toggleOrderedList().run()
          }}
          className={
            editor.isActive('orderedList')
              ? 'text-orangeFpt'
              : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <VscListOrdered className='w-5 h-5' />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className={'text-orange-300 hover:text-orangeFpt'}
        >
          <FaImage className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote')
            ? 'text-orangeFpt'
            : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <FaQuoteRight className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => {

            editor.chain().focus().undo().run()
          }}
          className={
            editor.isActive('undo')
              ? 'text-orangeFpt'
              : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <FaUndo className='w-5 h-5' />
        </button>
        <button
          type="button"
          onClick={() => {

            editor.chain().focus().redo().run()
          }}
          className={
            editor.isActive('redo')
              ? 'text-orangeFpt'
              : 'text-orange-300 hover:text-orangeFpt'
          }
        >
          <FaRedo className='w-5 h-5' />
        </button>
      </div>
    </div>
  )
}

export default Toolbar