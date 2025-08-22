'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import { useHotkeys } from 'react-hotkeys-hook'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  List as ListIcon, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Minus,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon
} from 'lucide-react'

interface SimpleEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

export function SimpleEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start writing your blog post...',
  className = ''
}: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      HorizontalRule,
      Image,
      Highlight,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Keyboard shortcuts - MUST be called before any conditional returns
  useHotkeys('mod+b', () => editor?.chain().focus().toggleBold().run())
  useHotkeys('mod+i', () => editor?.chain().focus().toggleItalic().run())
  useHotkeys('mod+u', () => editor?.chain().focus().toggleUnderline().run())
  useHotkeys('mod+`', () => editor?.chain().focus().toggleCode().run())

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const MenuBar = () => (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-white dark:bg-gray-900">
      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Code (Ctrl+`)"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Heading 1"
      >
        H1
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Heading 2"
      >
        H2
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Bullet List"
      >
        <ListIcon className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Special formatting */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('highlight') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('subscript') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Subscript"
      >
        <SubscriptIcon className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('superscript') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Superscript"
      >
        <SuperscriptIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Block elements */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Insert Image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* History */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      <MenuBar />
      <div className="p-4 min-h-[400px] bg-white dark:bg-gray-900">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none"
        />
        {!content && (
          <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleEditor
