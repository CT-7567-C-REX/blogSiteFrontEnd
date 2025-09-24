'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import HardBreak from '@tiptap/extension-hard-break'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

// Icons
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  CornerDownLeft,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react'

const MenuButton = ({
  onClick,
  isActive,
  icon: Icon,
  label,
}: {
  onClick: () => void
  isActive?: boolean
  icon: React.ElementType
  label?: string
}) => (
  <button
    onClick={onClick}
    title={label}
    className={`rounded-md border p-2 transition ${
      isActive
        ? 'border-orange-600 bg-orange-500 text-white'
        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
)

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export default function Editor({
  content = '',
  onChange,
  placeholder = 'Start writing your blog post...',
}: EditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Link,
      Image,
      CodeBlock,
      Blockquote,
      HorizontalRule,
      HardBreak,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const addImageFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        editor?.chain().focus().setImage({ src: reader.result }).run()
      }
    }
    reader.readAsDataURL(file)
  }

  const setLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!mounted || !editor) return null

  const showPlaceholder = editor.isEmpty && !editor.isFocused

  return (
    <div className="rounded-xl border bg-white shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3">
        {/* Headings */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          label="Heading 1"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          label="Heading 2"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          label="Heading 3"
        />

        {/* Basic formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          label="Bold"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          label="Italic"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={UnderlineIcon}
          label="Underline"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          label="Strikethrough"
        />

        {/* Lists */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          label="Bullet List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          label="Ordered List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={CheckSquare}
          label="Task List"
        />

        {/* Block elements */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          label="Blockquote"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={Code}
          label="Code Block"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          label="Horizontal Rule"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          icon={CornerDownLeft}
          label="Hard Break"
        />

        {/* Links & Images */}
        {/* <MenuButton onClick={setLink} icon={LinkIcon} label="Add Link" /> */}
        <label
          title="Upload Image"
          className="cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-100"
        >
          <ImageIcon className="h-4 w-4" />
          <input type="file" accept="image/*" onChange={addImageFromFile} className="hidden" />
        </label>

        {/* Undo / Redo */}
        <MenuButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} label="Undo" />
        <MenuButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} label="Redo" />
      </div>

      {/* Editor area */}
      <div className="relative prose min-h-[300px] max-w-none p-4 focus:ring-0 focus:outline-none">
        {showPlaceholder && (
          <div className="pointer-events-none absolute left-4 top-4 select-none text-gray-400">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} className="tiptap" />
      </div>
      <style jsx global>{`
        /* Ensure first block does not add extra top space */
        .tiptap > *:first-child { margin-top: 0 !important; }
        /* Normalize default spacing a bit for readability */
        .tiptap p { margin: 0 0 0.75rem 0; }
      `}</style>
    </div>
  )
}
