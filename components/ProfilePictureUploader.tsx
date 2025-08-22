'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { updateProfilePicture, removeProfilePicture } from 'services/user/routes'

interface ProfilePictureUploaderProps {
  currentImageUrl?: string | null
  onImageUpdate?: (newImageUrl: string) => void
  onSuccess?: () => void
  className?: string
}

export default function ProfilePictureUploader({
  currentImageUrl,
  onImageUpdate,
  className = ''
}: ProfilePictureUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setError(null)
    setSuccess(false)
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
    setError(null)
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (!selectedImage) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await updateProfilePicture(selectedImage)
      
      // Backend returns success message, we need to refresh the profile to get the new image URL
      // The profile will be updated on the backend, so we can just show success
      setSuccess(true)
      setSelectedImage(null)
      
      // Refresh the profile data to get the new image URL
      // This will trigger a re-render with the updated profile image
      if (onImageUpdate) {
        // We'll pass a placeholder since the backend doesn't return the URL directly
        // The parent component should refresh the profile data
        onImageUpdate('')
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!currentImageUrl) return

    setRemoving(true)
    setError(null)
    setSuccess(false)

    try {
      await removeProfilePicture()
      
      setSuccess(true)
      
      // Refresh the profile data to reflect the removed image
      if (onImageUpdate) {
        onImageUpdate('')
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to remove profile picture')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Show remove button if there's an existing profile picture */}
      {currentImageUrl && !selectedImage && (
        <div className="flex justify-center">
          <button
            onClick={handleRemove}
            disabled={removing}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {removing ? 'Removing...' : 'Remove Profile Picture'}
          </button>
        </div>
      )}

      <ImageUploader
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
        selectedImage={selectedImage}
        previewUrl={currentImageUrl}
        label="Profile Picture"
        maxSize={5}
        accept="image/*"
      />

      {selectedImage && (
        <div className="space-y-3">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Profile Picture'}
          </button>
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Profile picture updated successfully!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
