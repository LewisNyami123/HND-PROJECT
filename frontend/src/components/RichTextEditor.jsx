import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()) // send HTML back to parent
    },
  })

  return (
    <div className="editor">
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor