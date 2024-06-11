import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './ToolBar'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'

const Tiptap = ({ setContent, content }) => {

  const editor = useEditor({
    content: content,
    extensions: [StarterKit, Underline,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'What\'s on your mind, Hoan?',
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'w-full'
        }
      })],
    editorProps: {
      attributes: {
        class:
          'prose border text-base border-orange-100 pt-4 rounded-md outline-none  '
      }
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    }
  })

  return (
    <div className="w-full px-4 ">
      <div className='max-h-60 overflow-y-auto scrollbar-none-track mb-4'>
        <EditorContent editor={editor} />
      </div>
      <Toolbar editor={editor} />
    </div>
  )
}

export default Tiptap