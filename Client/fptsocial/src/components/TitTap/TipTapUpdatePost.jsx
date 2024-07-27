import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './ToolBar'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { uploadImage, uploadVideo } from '~/apis'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { IconEdit, IconFilePlus, IconPhotoPlus, IconSend2 } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm'

const TipTapUpdatePost = ({ setContent, content, type, listMedia, setListMedia, handleEdit }) => {
  const [isChoseFIle, setIsChoseFile] = useState(false)
  const [isHoverMedia, setIsHoverMedia] = useState(false)
  const [isEditMedia, setIsEditMedia] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenChoseFile = () => {
    setIsChoseFile(!isChoseFIle)
  }
  const confirmFile = useConfirm()

  const handleImageUpload = (event) => {
    const files = event.target.files
    const filesArray = Array.from(files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const error = singleFileValidator(file)
      if (error) {
        toast.error(error)
        return
      }
    }
    confirmFile({
      title: (<div>Confirm using this file?
        {filesArray?.map((e, i) => (
          e?.type?.includes('image') ? <img key={i} src={URL.createObjectURL(e)} /> : <video key={i} src={URL.createObjectURL(e)} />
        ))}
      </div>),
      description: ('Are you sure you want to add this file? This file will be add into cloud if you click Confirm and cannot undo? '),
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      filesArray?.map(e => {
        const fileData = new FormData()
        fileData.append('file', e)

        const type = e?.type?.includes('image') ? 'image' : 'video'
        type == 'image'
          ? uploadImage({ userId: null, data: fileData }).then(data => setListMedia(prev => [...prev, { type: 'image', url: data?.url }])).finally(() => setIsLoading(false))
          : uploadVideo({ userId: null, data: fileData }).then(data => setListMedia(prev => [...prev, { type: 'video', url: data?.url }])).finally(() => setIsLoading(false))
      })
      setIsLoading(true)
    }).catch(() => { })
    event.target.value = ''
  }

  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'Write something.',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose text-base mb-2 rounded-md outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    }
  })
  const handleRemoveCurrentContent = () => {
    if (editor) {
      editor.commands.setContent('')
    }
  }

  return (
    <div className="w-full px-3">
      <div className='max-h-72 overflow-y-auto scrollbar-none-track mb-2'>
        <EditorContent editor={editor} />
        {(isChoseFIle || listMedia?.length) > 0 && <div className={`${''} relative border border-gray-300 rounded-md `}>
          {
            listMedia?.length == 0 && !isLoading && (
              <div className='w-full h-[12rem] flex flex-col items-center justify-center text-base font-semibold bg-fbWhite cursor-pointer'
                onClick={() => document.getElementById('fileInput').click()}
              >
                <IconPhotoPlus />
                <span >Add Photos/Videos</span>
              </div>
            )
          }
          <div
            id="media"
            onMouseEnter={() => setIsHoverMedia(true)}
            onMouseLeave={() => setIsHoverMedia(false)}
            className='relative grid grid-cols-2 m-2'
          >
            <div className={`absolute inset-0 ${isHoverMedia && 'bg-[rgba(0,0,0,0.2)]'} rounded-md`}>
              {listMedia !== 0 && isHoverMedia && (
                <div className='absolute inset-0 flex gap-4 w-fit h-fit text-sm font-semibold left-1 top-1 z-10'>
                  <div
                    className='bg-white px-3 py-1 rounded-md flex gap-1 items-center cursor-pointer hover:bg-slate-100'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit()
                    }}
                  >
                    <IconEdit />Edit All
                  </div>
                  <div
                    className='bg-white px-3 py-1 rounded-md flex gap-1 items-center cursor-pointer hover:bg-slate-100'
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById('fileInput').click()
                    }}
                  >
                    <IconFilePlus />Add Photos/Videos
                  </div>
                </div>
              )}
            </div>

            {listMedia?.map((e, key) => {
              if (e?.type == 'image') {
                // let url = e?.media?.photoUrl || e?.media?.photo?.photoUrl
                return <img
                  key={key}
                  src={e?.url}
                  className={`${listMedia.length % 2 !== 0
                    ? key === 0
                      ? 'col-span-2'
                      : 'col-span-1'
                    : 'col-span-1'} h-full object-cover`}
                />
              }
              else {
                // let url = e?.media?.videoUrl || e?.media?.video?.videoUrl
                return <video
                  key={key}
                  src={e?.url}
                  className={`${listMedia.length % 2 !== 0
                    ? key === 0
                      ? 'col-span-2'
                      : 'col-span-1'
                    : 'col-span-1'} h-full object-cover`}
                  controls
                  disablePictureInPicture
                />
              }
            })}

            {isLoading && <div className='col-span-2 h-20'><PageLoadingSpinner /></div>}
          </div>
        </div>}
      </div>
      <div>
        <input type="file"
          id="fileInput"
          multiple
          className='hidden' accept="image/*,video/*"
          onChange={handleImageUpload}
        />
      </div>
      <div className='flex items-center bg-fbWhite'>
        <Toolbar editor={editor} handleOpenChoseFile={handleOpenChoseFile} type={type} isChooseFile={isChoseFIle} />
        {
          type == 'comment' && (
            <button type='submit' onClick={handleRemoveCurrentContent} className='mr-2'>
              <IconSend2 className='text-blue-500 rounded-full size-8 hover:bg-blue-200 p-1' stroke={1} />
            </button>
          )
        }
      </div>

    </div >
  )
}

export default TipTapUpdatePost