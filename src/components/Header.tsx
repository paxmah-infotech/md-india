'use client'

import { signOut, useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { LuLogOut } from 'react-icons/lu'
import { FiUser, FiGrid, FiHome, FiPlus, FiLogIn } from 'react-icons/fi'
import Confirm from './Confirm'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import useOutsideClick from '@/utils/documentOutSideClick'
import { siteConfig } from '@/config/site.config'
import Image from 'next/image'

interface NavItem {
  path: string
  icon: React.ElementType
  label: string
  requiresAuth: boolean
}

const Header: React.FC = () => {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const pathname = usePathname()
  const divRef = useRef(null)

  useOutsideClick(divRef, () => setMenuOpen(false))

  const handleLogout = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    signOut({ 
      callbackUrl: `${baseUrl}/auth/signin`
    });
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const handleConfirmOpen = () => setConfirmOpen(true)
  const handleConfirmClose = () => setConfirmOpen(false)

  const isActive = (path: string) => pathname === path

  const navItems: NavItem[] = [
    { path: '/', icon: FiHome, label: 'Home', requiresAuth: false },
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard', requiresAuth: true },
    { path: '/new', icon: FiPlus, label: 'Create QR', requiresAuth: true },
    { path: '/profile', icon: FiUser, label: 'Profile', requiresAuth: true }
  ]

  const visibleNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && status === 'authenticated')
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/75 backdrop-blur-lg">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={80}
              height={80}
              quality={100}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full"
              priority
            />
            <span className="font-bold text-gray-500 text-base sm:text-lg lg:text-xl">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:items-center sm:space-x-1 md:space-x-2 lg:space-x-3">
            {visibleNavItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                href={path}
                className={`flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="mr-1.5 h-4 w-4" />
                {label}
              </Link>
            ))}
            {status === 'authenticated' ? (
              <button
                onClick={handleConfirmOpen}
                className="flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <LuLogOut className="mr-1.5 h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <FiLogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-700 hover:bg-gray-100 sm:hidden"
          >
            <HiMenu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <motion.nav
          ref={divRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden bg-white border-t"
        >
          <div className="py-2 space-y-1">
            {visibleNavItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                href={path}
                className={`flex items-center px-4 py-2 text-sm font-medium ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {label}
              </Link>
            ))}
            {status === 'authenticated' ? (
              <button
                onClick={handleConfirmOpen}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <LuLogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <FiLogIn className="mr-3 h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </motion.nav>
      )}

      {/* Logout Confirmation Dialog */}
      <Confirm
        isOpen={isConfirmOpen}
        onConfirm={handleLogout}
        onCancel={handleConfirmClose}
        message="Are you sure you want to log out?"
      />
    </header>
  )
}

export default Header
