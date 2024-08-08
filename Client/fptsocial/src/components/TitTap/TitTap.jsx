import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useState } from 'react'
import { uploadImage, uploadVideo } from '~/apis'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { IconEdit, IconFilePlus, IconPhotoPlus, IconSend2, IconX } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm'
import { CREATE, EDITOR_TYPE, POST_TYPES } from '~/utils/constants'
import { Button } from '@mui/material'
import Toolbar from './ToolBar'
import { useTranslation } from 'react-i18next'

const Tiptap = ({ setContent, content, listMedia, setListMedia, postType, actionType, editorType, handleEdit }) => {
  console.log('🚀 ~ Tiptap ~ content:', content)
  const [isChoseFile, setIsChoseFile] = useState(false)
  const [isHoverMedia, setIsHoverMedia] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const confirmFile = useConfirm()
  const { t } = useTranslation()
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

      setIsLoading(true)
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const type = file.type.includes('image') ? 'image' : 'video'
        const data = type === 'image'
          ? await uploadImage({ userId: null, data: formData })
          : await uploadVideo({ userId: null, data: formData })
        setListMedia(prev => [...prev, { url: data.url, type }])
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
      Underline,
      Placeholder.configure({ placeholder: t('standard.newPost.writeSt') }),
    ],
    editorProps: { attributes: { class: 'mb-2 text-base rounded-md outline-none', spellcheck: 'false', } },
    onUpdate: ({ editor }) => setContent(editor.getHTML())
  })

  const handleRemoveCurrentContent = () => editor?.commands.setContent('')

  return (
    <div className="w-full px-3">
      <div className='max-h-72 overflow-y-auto scrollbar-none-track mb-2'>
        <EditorContent editor={editor} />

        {(isChoseFile || listMedia?.length > 0) && (
          <div className={`relative border border-gray-300 rounded-md`}>
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
              onMouseEnter={() => setIsHoverMedia(true)}
              onMouseLeave={() => setIsHoverMedia(false)}
              className='relative grid grid-cols-2 m-2'
            >
              <div className={`absolute inset-0 ${isHoverMedia && 'bg-[rgba(0,0,0,0.2)]'} rounded-md`}>
                {(listMedia.length !== 0) && isHoverMedia && (
                  <div className='absolute right-0 flex gap-4 h-fit text-sm font-semibold top-1 z-10'>
                    <div
                      className='bg-white px-3 py-1 rounded-md flex gap-1 items-center cursor-pointer hover:bg-orangeFpt hover:text-white'
                      onClick={e => { e.stopPropagation(); handleEdit() }}
                    >
                      <IconEdit />{t('standard.newPost.editAll')}
                    </div>
                    <div
                      className='bg-white px-3 py-1 rounded-md flex gap-1 items-center cursor-pointer hover:bg-orangeFpt hover:text-white'
                      onClick={e => { e.stopPropagation(); document.getElementById('fileInput').click() }}
                    >
                      <IconFilePlus />{t('standard.newPost.addPhoto')}
                    </div>
                    <div
                      className='bg-white p-2 rounded-full flex gap-1 cursor-pointer hover:bg-orangeFpt hover:text-white'
                      onClick={e => { e.stopPropagation(); setListMedia([]) }}
                    >
                      <IconX />
                    </div>
                  </div>
                )}
              </div>

              {listMedia.map((media, index) => (
                media.type === 'image'
                  ? <img key={index} src={media.url} className={`w-full h-full object-cover ${listMedia.length % 2 !== 0 && index === 0 ? 'col-span-2' : 'col-span-1'}`} />
                  : <video key={index} src={media.url} className={`w-full h-full object-cover ${listMedia.length % 2 !== 0 && index === 0 ? 'col-span-2' : 'col-span-1'}`} controls disablePictureInPicture />
              ))}

              {isLoading && <div className='col-span-2 h-20'><PageLoadingSpinner /></div>}
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        id="fileInput"
        multiple
        className='hidden'
        accept="image/*,video/*"
        onChange={handleImageUpload}
      />

      <div className={`flex ${(postType === POST_TYPES.SHARE_POST || postType === POST_TYPES.GROUP_SHARE_POST) ? 'justify-end' : 'bg-fbWhite'} items-center`}>
        {
          !(postType === POST_TYPES.SHARE_POST || postType === POST_TYPES.GROUP_SHARE_POST) && <Toolbar editor={editor} handleOpenChoseFile={handleOpenChoseFile} isChooseFile={isChoseFile} postType={postType} />
        }
        {editorType === EDITOR_TYPE.COMMENT && (
          <button type='submit' onClick={handleRemoveCurrentContent} className='mr-2'
            style={{
              opacity: (content.replace(/<\/?[^>]+(>|$)/g, "").length == 0) ? '0.5' : 'initial',
              pointerEvents: (content.replace(/<\/?[^>]+(>|$)/g, "").length == 0) ? 'none' : 'initial'
            }}
          >
            <IconSend2 className='text-blue-500 rounded-full size-8 hover:bg-blue-200 p-1' stroke={1} />
          </button>
        )}

        {(postType === POST_TYPES.SHARE_POST || postType === POST_TYPES.GROUP_SHARE_POST) && actionType === CREATE && (
          <Button type='submit' variant="contained" onClick={handleRemoveCurrentContent} color="warning"
          >
            {t('standard.newPost.post')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Tiptap