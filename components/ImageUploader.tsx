'use client'

import { useState, useRef, useCallback } from 'react'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  onImageRemove?: () => void
  selectedImage?: File | null
  previewUrl?: string | null
  accept?: string
  maxSize?: number // in MB
  className?: string
  label?: string
  placeholder?: string
}

export default function ImageUploader({
  onImageSelect,
  onImageRemove,
  selectedImage,
  previewUrl,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  className = '',
  label = 'Upload Image',
  placeholder = 'Click to select or drag and drop an image'
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file'
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    return null
  }, [maxSize])

  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    onImageSelect(file)
  }, [validateFile, onImageSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemove = useCallback(() => {
    if (onImageRemove) {
      console.log('onImageRemove')
      onImageRemove()
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onImageRemove])

  const displayPreview = selectedImage ? URL.createObjectURL(selectedImage) : previewUrl

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {!displayPreview ? (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                onClick={handleClick}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Click to upload
              </button>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative mx-auto max-w-xs">
              <img
                src={displayPreview}
                alt="Preview"
                className="h-32 w-32 rounded-lg object-cover mx-auto"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                onClick={handleClick}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Change image
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {selectedImage && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  )
}
