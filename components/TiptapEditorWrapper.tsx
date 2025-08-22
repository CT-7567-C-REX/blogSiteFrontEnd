'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

interface TiptapEditorWrapperProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

// Dynamically import the Tiptap editor with no SSR
const TiptapEditor = dynamic(
  () => import('@/components/tiptap-templates/simple/simple-editor').then(mod => mod.SimpleEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="p-4 min-h-[400px] bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-gray-400 dark:text-gray-500">Loading editor...</span>
          </div>
        </div>
      </div>
    )
  }
)

export default function TiptapEditorWrapper(props: TiptapEditorWrapperProps) {
  return <TiptapEditor {...props} />
}
