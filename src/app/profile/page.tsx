'use client'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Confirm from '@/components/Confirm'
import axios from 'axios' // Axios for API calls
import { toast } from 'react-toastify' // For showing notifications
import { deleteAccount, updateUser } from '@/utils/apiHandlers'
import { refreshSession } from '@/utils/refreshSession'
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'

import Link from 'next/link'
import { LuFileJson2, LuLogOut } from 'react-icons/lu'
import Image from 'next/image'

const Profile: React.FC = () => {
  const { data: session, update }:any = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleteFinalConfirmOpen, setDeleteFinalConfirmOpen] = useState(false)
  const [userName, setUserName] = useState(session?.user?.name || '')
  const [userEmail, setUserEmail] = useState(session?.user?.email || '')
  const [isSaveEnabled, setIsSaveEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const handleConfirmOpen = () => setConfirmOpen(true)
  const handleConfirmClose = () => setConfirmOpen(false)
  const handleLogout = () => {
    signOut({ 
      callbackUrl: '/auth/signin'
    });
  }

  useEffect(() => {
    setUserName(session?.user?.name || '')
    setUserEmail(session?.user?.email || '')
  }, [session])

  // Update user details API function
  const updateUserDetails = async () => {
    try {
      const response = await updateUser(userName, userEmail)

      toast.success('Profile updated successfully!')
      setIsEditing(false)
      update({ name: userName })
    } catch (err) {
      setError(
        'An error occurred while updating the profile. Please try again.'
      )
      console.error(err)
    }
  }

  // Delete user account API function
  const handleDeleteAccount = async (inputValue?: string) => {
    try {
      if (inputValue?.toLowerCase() === 'delete') {
        const response = await deleteAccount()
        console.log("response : ", response?.success)
        if (response?.message) {
          toast.success('Account deleted successfully.')
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          signOut({ 
            callbackUrl: '/auth/signin'
          });
        }
      }
    } catch (err) {
      setError(
        'An error occurred while deleting the account. Please try again.'
      )
      console.error(err)
    }
  }

  // Confirm delete account
  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true)
  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false)

  // Handle the second delete confirmation (final confirmation)
  const handleDeleteFinalConfirmOpen = () => {
    setDeleteConfirmOpen(false) // Close the first confirmation
    setDeleteFinalConfirmOpen(true) // Open the second confirmation
  }
  const handleDeleteFinalConfirmClose = () => setDeleteFinalConfirmOpen(false)

  // Confirm and proceed to delete the account after final confirmation
  const handleDeleteFinalConfirmation = (inputValue?: string) => {
    handleDeleteAccount(inputValue) // Proceed to delete the account
    setDeleteFinalConfirmOpen(false) // Close the final confirmation dialog
  }

  // Handle profile editing toggle
  const handleEditToggle = () => {
    setIsEditing(prev => !prev)
    setError(null) // Clear any previous errors
  }

  // Handle changes to user input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
    checkIfChangesMade(e.target.value, userEmail)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value)
    checkIfChangesMade(userName, e.target.value)
  }

  // Check if there are any changes to enable the save button
  const checkIfChangesMade = (newName: string, newEmail: string) => {
    if (newName !== session?.user?.name || newEmail !== session?.user?.email) {
      setIsSaveEnabled(true)
    } else {
      setIsSaveEnabled(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 text-black'>
      <Header />

      <main className='p-4 lg:p-8'>
        {/* Profile Details Section */}
        <section className='bg-white shadow-md rounded-lg p-6 mb-6'>
          <div className='flex items-center space-x-4'>
            <div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500'>
              {session?.user?.image ? (
                <Image
                  src={session?.user?.image || ""}
                  alt='User Avatar'
                  className='w-full h-full object-cover rounded-full'
                  width={200}
                  height={200}
                />
              ) : (
                <span className='text-2xl font-bold'>
                  {session?.user?.name
                    ? session?.user?.name.charAt(0).toUpperCase()
                    : session?.user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>
                {session?.user?.name ||
                  session?.user?.email?.split('@')[0].replace(/\d+/g, '') ||
                  'User'}
              </h2>
              <p className='text-gray-600'>
                {session?.user?.email || 'm@example.com'}
              </p>
            </div>
          </div>
        </section>

        {/* Edit Profile Section */}
        <section className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-4'>
            Profile Actions
          </h3>
          {!isEditing ? (
            <div>
              <p className='mb-4 text-gray-700'>
                You can edit your profile or delete your account from here.
              </p>
              <button
                onClick={handleEditToggle}
                className='w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700'
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form
              className='space-y-4'
              onSubmit={e => {
                e.preventDefault()
                updateUserDetails()
              }}
            >
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={userName}
                  onChange={handleNameChange}
                  className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div
                onClick={() =>
                  alert(
                    'The email address cannot be changed at this time. This feature will be available in the future.'
                  )
                }
              >
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email <span className='text-xs text-gray-500'>(Read Only)</span>
                </label>
                <input
                  id='email'
                  type='email'
                  value={userEmail}
                  onChange={handleEmailChange}
                  disabled
                  className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              {error && <p className='text-red-500'>{error}</p>}

              <div className='flex space-x-2'>
                <button
                  type='submit'
                  disabled={!isSaveEnabled}
                  className={`w-full py-2 rounded-md shadow-md ${
                    isSaveEnabled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  Save Changes
                </button>
                <button
                  type='button'
                  onClick={handleEditToggle}
                  className='w-full bg-gray-300 text-gray-700 py-2 rounded-md shadow-md hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Export Data Section */}
        <section className='bg-white shadow-md rounded-lg p-6 mt-6 text-black'>
          <h3 className='text-lg font-medium text-gray-800 mb-4'>
            Export Your Data
          </h3>
          <p className='text-gray-700 mb-4'>
            You can export your data in different formats for your records.
          </p>
          <div className='space-y-4'>
            {/* JSON Export */}
            <Link
              href='/export'
              target='_blank'
              className='flex items-center text-blue-600 hover:underline'
            >
              <LuFileJson2 className='w-5 h-5 mr-2' />
              <span>Export as JSON</span>
            </Link>

            {/* Excel Export */}
            <Link
              href='/export'
              target='_blank'
              className='flex items-center text-green-600 hover:underline'
            >
              <FaFileExcel className='w-5 h-5 mr-2' />
              <span>Export as Excel</span>
            </Link>

            {/* PDF Export */}
            <Link
              href='/export'
              target='_blank'
              className='flex items-center text-red-600 hover:underline'
            >
              <FaFilePdf className='w-5 h-5 mr-2' />
              <span>Export as PDF</span>
            </Link>
          </div>
        </section>

        <section className='bg-white shadow-md rounded-lg p-6 mt-6'>
          <button
            onClick={handleConfirmOpen}
            className='w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-md shadow-md hover:bg-red-600 transition-colors'
          >
            <LuLogOut className='w-5 h-5' />
            <span className='text-sm font-medium tracking-wide'>Log Out</span>
          </button>
        </section>

        {/* Sensitive Actions Section */}
        <section className='bg-white shadow-md rounded-lg p-6 mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-4'>
            Danger Zone
          </h3>
          <button
            onClick={handleDeleteConfirmOpen}
            className='w-full bg-red-600 text-white py-2 rounded-md shadow-md hover:bg-red-700'
          >
            Delete Account
          </button>
        </section>

        {/* Confirm Dialog for Delete Account */}
        <Confirm
          isOpen={isDeleteConfirmOpen}
          onConfirm={handleDeleteFinalConfirmOpen}
          onCancel={handleDeleteConfirmClose}
          message='Are you sure you want to delete your account? This action cannot be undone.'
        />

        {/* Second Confirm Dialog for Delete Account */}
        <Confirm
          isOpen={isDeleteFinalConfirmOpen}
          onConfirm={handleDeleteFinalConfirmation}
          onCancel={handleDeleteFinalConfirmClose}
          message="Once you delete your account, you won't be able to access it anymore. Type 'DELETE' to confirm that you want to permanently delete your account."
          showInput={true}
        />

        {/* Confirm Dialog for Logout */}
        <Confirm
          isOpen={isConfirmOpen}
          onConfirm={handleLogout}
          onCancel={handleConfirmClose}
          message='Are you sure you want to log out?'
        />
      </main>
    </div>
  )
}

export default Profile
