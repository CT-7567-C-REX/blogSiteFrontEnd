'use client'

import { useState } from 'react'

interface ClickableProfilePictureProps {
  imageUrl?: string | null
  username: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

export default function ClickableProfilePicture({
  imageUrl,
  username,
  size = 'md',
  onClick,
  className = '',
}: ClickableProfilePictureProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  }

  const sizeClassesWithHover = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  }

  return (
    <div
      className={`group relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={username}
          className={`${sizeClasses[size]} rounded-full object-cover transition-all duration-200 group-hover:opacity-80`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-gray-200 transition-all duration-200 group-hover:opacity-80 dark:bg-gray-800`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`text-gray-600 dark:text-gray-300 ${
              size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'
            }`}
          >
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
          </svg>
        </div>
      )}

      {/* Edit overlay */}
      {isHovered && (
        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black transition-all duration-200">
          <span className="text-sm font-medium text-white">Edit</span>
        </div>
      )}
    </div>
  )
}
