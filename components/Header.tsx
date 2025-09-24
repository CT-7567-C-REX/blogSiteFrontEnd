'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useEffect, useRef, useState } from 'react'
import { accessToken, currentUsername } from 'services/session'
import { logout as logoutRequest } from 'services/auth/routes'
import { useRouter } from 'next/navigation'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [username, setUsername] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(!!accessToken())
    setUsername(currentUsername())
    const onChange = () => {
      setIsAuthenticated(!!accessToken())
      setUsername(currentUsername())
    }
    window.addEventListener('session-changed', onChange)
    return () => window.removeEventListener('session-changed', onChange)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutRequest()
      setMenuOpen(false)
      router.push('/')
    } catch {
      // ignore
    }
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        {isAuthenticated && (
          <Link
            href="/createPost"
            className="bg-primary-500 hover:bg-primary-600 hidden rounded px-3 py-1 text-sm font-medium text-white sm:inline-block"
          >
            Create
          </Link>
        )}
        <MobileNav />
        {!isAuthenticated && (
          <Link
            href="/login"
            className="hover:text-primary-500 dark:hover:text-primary-400 rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
          >
            Login
          </Link>
        )}
        {isAuthenticated && (
          <div className="relative" ref={menuRef}>
            <button
              aria-label="User menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <Link
                  href={username ? `/profile/${username}` : '/profile'}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
