import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import { uploadImage, uploadVideo } from '~/apis'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { IconFilePlus, IconMoodHappy, IconPhotoPlus, IconPhotoUp, IconSend2, IconX } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm'
import { useTranslation } from 'react-i18next'
import EmojiPicker from 'emoji-picker-react'

const TipTapMes = ({ setContent, content, listMedia, setListMedia, sendMessage }) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false)
  const isEmptyComment = ((content?.replace(/<\/?[^>]+(>|$)/g, "")?.length == 0 || !content) && listMedia?.length == 0)
  const [isChoseFile, setIsChoseFile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const confirmFile = useConfirm()
  const { t } = useTranslation()
  const emojiPickerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setIsOpenEmoji(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleOpenChoseFile = () => setIsChoseFile(!isChoseFile)

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    for (const file of files) {
      const error = singleFileValidator(file)
      if (error) {
        toast.error(error)
        return
      }
    }
    try {
      await confirmFile({
        title: (
          <div>Confirm using this file?
            {files.map((file, index) => (
              file.type.includes('image')
                ? <img key={index} src={URL.createObjectURL(file)} />
                : <video key={index} src={URL.createObjectURL(file)} controls />
            ))}
          </div>
        ),
        description: 'Are you sure you want to add this file? This file will be added to the cloud if you click Confirm and cannot undo.',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })
      setIsLoading((pre) => true)

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const type = file.type.includes('image') ? 'image' : 'video'
        const data = type === 'image'
          ? await uploadImage({ userId: null, data: formData })
          : await uploadVideo({ userId: null, data: formData })

        setListMedia(prev => [...prev, { url: data.url, type, position: prev?.length || 0 }])
      }
    } catch (error) {
      // Handle cancel or error
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  const editor = useEditor({
    content,
    extensions: [
      StarterKit,
      Placeholder.configure({ emptyEditorClass: 'is-editor-empty', placeholder: t('standard.newPost.writeSt') }),
    ],
    editorProps: { attributes: { class: 'mb-2 text-base rounded-md outline-none', spellcheck: 'false', } },
    onUpdate: ({ editor }) => setContent(editor.getHTML())
  })

  const handleRemoveCurrentContent = () => editor?.commands.setContent('')

  return (
    <div className="w-full px-3">
      <div className='max-h-72 overflow-y-auto scrollbar-none-track mb-2'>
        {(isChoseFile || listMedia?.length > 0) && (
          <div className={`relative border border-gray-300/90 rounded-2xl mb-2`}>
            {listMedia?.length === 0 && !isLoading && (
              <div
                className='w-full h-48 flex flex-col items-center justify-center text-base font-semibold bg-fbWhite cursor-pointer'
                onClick={() => document.getElementById('fileInput').click()}
              >
                <IconPhotoPlus />
                <span>{t('standard.newPost.addPhoto')}</span>
              </div>
            )}
            <div
              id="media"
              className='p-2 flex gap-2 items-center'
            >
              {(listMedia.length !== 0) && (
                <div
                  className='p-3 cursor-pointer hover:bg-orangeFpt hover:text-white rounded-md'
                  onClick={() => { document.getElementById('fileInput').click() }}
                >
                  <IconFilePlus />
                </div>
              )}
              <div className='flex gap-2 flex-wrap w-full'>
                {listMedia?.map((media, index) => (
                  <div key={index} className="relative w-1/5">
                    <div className='absolute top-1 right-1 size-6 z-60 bg-white p-1 rounded-full flex justify-center items-center hover:bg-orangeFpt hover:text-white cursor-pointer'
                      onClick={() => setListMedia(prevList => prevList.filter((_, i) => i !== index))}
                    >
                      <IconX />
                    </div>
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        className="object-cover w-full h-full"
                        alt={`Media ${index}`}
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="object-cover w-full h-full"
                        controls
                        disablePictureInPicture
                      />
                    )}
                  </div>
                ))}
                {isLoading && <div className='w-1/5 h-20'><PageLoadingSpinner /></div>}
              </div>
            </div>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      <input
        type="file"
        id="fileInput"
        multiple
        className='hidden'
        accept="image/*,video/*"
        onChange={handleImageUpload}
      />

      <div
        className="px-4 py-2 rounded-3xl flex w-full bg-fbWhite"
      >
        <div className='flex justify-start items-center gap-3 w-full flex-wrap'>
          <button
            type="button"
            onClick={handleOpenChoseFile}
            className={`text-orange-300 hover:text-orangeFpt ${isChoseFile && '!text-orangeFpt'}`}
          >
            <IconPhotoUp className='w-5 h-5' />
          </button>
          <div
            className={
              isOpenEmoji
                ? 'text-orangeFpt cursor-pointer'
                : 'text-orange-300 hover:text-orangeFpt cursor-pointer'
            }
          >
            <IconMoodHappy className='w-5 h-5' onClick={() => setIsOpenEmoji(prev => !prev)} />
            <div ref={emojiPickerRef}>
              <EmojiPicker
                open={isOpenEmoji}
                lazyLoadEmojis={true}
                onEmojiClick={(emoji) => { editor?.commands.insertContent(emoji?.emoji) }}
                emojiStyle={'native'}
                searchDisabled={true}
                height={300}
                width={320}
                suggestedEmojisMode={'recent'}
                skinTonesDisabled={true}
                previewConfig={{
                  showPreview: false
                }}
                className='!absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 shadow-4edges'
              />
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            if (!isEmptyComment) {
              sendMessage()
              handleRemoveCurrentContent()
              setIsChoseFile(false)
            }
          }}
          className='mr-2 interceptor-loading '
        >
          <IconSend2 className={`text-blue-500 rounded-full size-10  p-1 ${isEmptyComment ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-200'}`} stroke={2} />
        </div>
      </div>


    </div>
  )
}

export default TipTapMes