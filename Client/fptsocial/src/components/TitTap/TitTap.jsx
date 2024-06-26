import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './ToolBar'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { IconEdit, IconFilePlus, IconPhotoPlus, IconX } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { Text } from '@mantine/core'
import { uploadImage, uploadVideo } from '~/apis'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'

const Tiptap = ({ setContent, content, listPhotos, setListPhotos, listVideos, setListVideos }) => {
  const [isChoseFIle, setIsChoseFile] = useState(false)
  const [isHoverMedia, setIsHoverMedia] = useState(false)
  const [isEditMedia, setIsEditMedia] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenChoseFile = () => {
    setIsChoseFile(!isChoseFIle)
  }

  const handleImageUpload = (event) => {
    const fileData = new FormData()
    const file = event.target.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    fileData.append('file', file)
    const url = URL.createObjectURL(file)
    const type = file?.type?.includes('image') ? 'image' : 'video'
    modals.openConfirmModal({
      title: 'Add this file?',
      centered: true,
      children: (
        <div>
          {
            type == 'image' ? <img src={url} /> : <video src={url} />
          }
          <Text size="sm">
            Are you sure you want to add this file? This file will be add into cloud if you click Add
            and cannot undo?
          </Text>
        </div>
      ),
      labels: { confirm: 'Add', cancel: 'Cancel' },
      confirmProps: { color: 'blue' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        type == 'image'
          ? uploadImage({ userId: null, data: fileData }).then(data => setListPhotos([...listPhotos, data?.url])).finally(() => setIsLoading(false))
          : uploadVideo({ userId: null, data: fileData }).then(data => setListVideos([...listVideos, data?.url])).finally(() => setIsLoading(false))
        setIsLoading(true)
      }
    })
    event.target.value = ''
  }
  useEffect(() => {
    console.log(isLoading);
  }, [isLoading])

  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'What\'s on your mind, Hoan?',
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


  return (
    <div className="w-full px-3">
      <div className='max-h-72 overflow-y-auto scrollbar-none-track mb-2'>
        <EditorContent editor={editor} />
        {isChoseFIle && <div className={`${''} relative border border-gray-300 rounded-md `}>
          {
            listPhotos.length == 0 && listVideos.length == 0 && !isLoading && (
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
              {(listVideos.length !== 0 || listPhotos.length !== 0) && isHoverMedia && (
                <div className='absolute inset-0 flex gap-4 w-fit h-fit text-sm font-semibold left-1 top-1 z-10'>
                  <div
                    className='bg-white px-3 py-1 rounded-md flex gap-1 items-center cursor-pointer hover:bg-slate-100'
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditMedia(!isEditMedia);
                    }}
                  >
                    <IconEdit />Edit All
                  </div>
                  <div
                    className='bg-white px-3 py-1 rounded-md flex gap-1 items-center cursor-pointer hover:bg-slate-100'
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('fileInput').click();
                    }}
                  >
                    <IconFilePlus />Add Photos/Videos
                  </div>
                  {/* <div className='bg-white p-2 rounded-full flex gap-1 cursor-pointer'
          onClick={(e) => { e.stopPropagation(); }}
        ><IconX /></div> */}
                </div>
              )}
            </div>

            {listPhotos?.map((photo, key) => (
              <img
                key={photo}
                src={photo}
                className={`${listPhotos.length % 2 !== 0
                  ? key === 0
                    ? 'col-span-2'
                    : 'col-span-1'
                  : 'col-span-1'} h-full object-cover`}
              />
            ))}

            {listVideos?.map((video, key) => (
              <video
                key={video}
                src={'http://res.cloudinary.com/dqitgxwfl/video/upload/v1719392614/video/null/swvyfskptez8oclxccwo.mp4'}
                className={`${listVideos.length % 2 !== 0
                  ? key === 0
                    ? 'col-span-2'
                    : 'col-span-1'
                  : 'col-span-1'} h-full object-cover`}
                controls
                disablePictureInPicture
              />
            ))}
            {isLoading && <div className='col-span-2 h-20'><PageLoadingSpinner /></div>}


          </div>
        </div>}
      </div>
      <div>
        <input type="file" id="fileInput"
          className='hidden' accept="image/*,video/*"
          onChange={handleImageUpload}
        />
      </div>
      <Toolbar editor={editor} handleOpenChoseFile={handleOpenChoseFile} />
    </div >
  )
}

export default Tiptap