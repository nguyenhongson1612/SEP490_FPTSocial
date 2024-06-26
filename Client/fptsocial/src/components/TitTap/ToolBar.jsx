// 'use client'
import { FaBold, FaItalic, FaRedo, FaQuoteRight, FaUndo, FaUnderline, FaImage } from 'react-icons/fa'
import { AiOutlineEnter } from 'react-icons/ai'
import { MdFormatListBulleted, MdOutlineStrikethroughS, MdEmojiEmotions } from 'react-icons/md'
import { VscListOrdered } from 'react-icons/vsc'
import { useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'


const Toolbar = ({ editor, handleOpenChoseFile }) => {

  const imgInputRef = useRef(null)
  const vidInputRef = useRef(null)
  const [isOpenEmoji, setIsOpenEmoji] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('1');
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setNode('nodeMedia', {
          // src: reader.result,
          src: 'data:image/jpeg;base64,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',
        }).run();
      }
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    // console.log('🚀 ~ handleImageUpload ~ e.target.files[0]:', e.target.files[0])
    // console.log(file);
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        // editor.commands.setVideo({ src: reader.result })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  if (!editor) {
    return null
  }
  return (
    <div
      className="px-2 py-2 rounded-md flex w-full bg-fbWhite relative"
    >
      <div className='flex justify-start items-center gap-3 w-full flex-wrap '>
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

        <button
          type="button"
          onClick={handleOpenChoseFile}
          className={'text-orange-300 hover:text-orangeFpt'}
        >
          <FaImage className='w-5 h-5' />
        </button>

        <div
          className={
            isOpenEmoji
              ? 'text-orangeFpt cursor-pointer'
              : 'text-orange-300 hover:text-orangeFpt cursor-pointer'
          }
        >
          <MdEmojiEmotions className='w-5 h-5' onClick={() => setIsOpenEmoji(!isOpenEmoji)} />
          <EmojiPicker
            open={isOpenEmoji}
            lazyLoadEmojis={true}
            onEmojiClick={(emoji) => {
              // console.log(emoji)
              editor?.commands.insertContent(emoji?.emoji)
            }}
            emojiStyle={'facebook'}
            searchDisabled={true}
            height={300}
            width={320}
            suggestedEmojisMode={'recent'}
            skinTonesDisabled={true}
            previewConfig={{
              showPreview: false
            }}
            // autoFocusSearch={false}
            // allowExpandReactions={false}
            // reactionsDefaultOpen={true}
            className='!absolute !bottom-20 md:!bottom-10 !-right-8 md:!-right-40 lg:!-right-56 shadow-4edges'
          />
        </div>
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