'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input, Button } from '@nextui-org/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Header from '@/components/Header'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({
    browser: 'Unknown Browser',
    os: 'Unknown OS',
    location: 'Unknown Location'
  })

  const handlePasswordToggle = () => setShowPassword(!showPassword)

  // Move device detection to useEffect
  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = window.navigator.userAgent
      const browsers = [
        { name: 'Edge', value: 'Edg' },
        { name: 'Chrome', value: 'Chrome' },
        { name: 'Firefox', value: 'Firefox' },
        { name: 'Safari', value: 'Safari' },
        { name: 'Opera', value: 'Opera' }
      ]

      for (const browser of browsers) {
        if (userAgent.indexOf(browser.value) > -1) {
          return browser.name
        }
      }
      return 'Unknown Browser'
    }

    const detectOS = () => {
      const userAgent = window.navigator.userAgent
      const os = [
        { name: 'Windows', value: 'Win' },
        { name: 'MacOS', value: 'Mac' },
        { name: 'Linux', value: 'Linux' },
        { name: 'Android', value: 'Android' },
        { name: 'iOS', value: 'iPhone' }
      ]

      for (const system of os) {
        if (userAgent.indexOf(system.value) > -1) {
          return system.name
        }
      }
      return 'Unknown OS'
    }

    // Get location
    const getLocation = async () => {
      try {
        const locationRes = await fetch('/api/auth/get-location')
        const locationData = await locationRes.json()
        return locationData.location
      } catch (error) {
        console.error('Error fetching location:', error)
        return 'Unknown Location'
      }
    }

    // Set device info
    const setDeviceInformation = async () => {
      const browser = detectBrowser()
      const os = detectOS()
      const location = await getLocation()
      setDeviceInfo({ browser, os, location })
    }

    setDeviceInformation()
  }, []) // Empty dependency array means this runs once on mount

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Clear any previous errors
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email: email,
        password: password,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        location: deviceInfo.location,
        redirect: false,
      })

      if (res?.error) {
        // Handle specific error cases
        setError(res.error)
        toast.error(res.error || 'Sign-in failed')
        setLoading(false)
        return
      }

      // Successful sign-in
      toast.success('Successfully signed in!')
      window.location.href = '/'
    } catch (error: any) {
      // Handle network or unexpected errors
      const errorMessage = error.message || 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Header />
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-4 text-black'>
      <div className='w-full max-w-md p-8 my-14 bg-white rounded-lg shadow-md'>
        <h1 className='mb-6 text-3xl font-semibold text-center text-gray-800'>
          Sign In
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className='p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded'>
            {success}
          </div>
        )}

        <form onSubmit={onSignIn} className='space-y-6'>
          <div>
            <Input
              id='email'
              type='email'
              label='Email'
              value={email}
              variant='bordered'
              required
              onChange={e => setEmail(e.target.value)}
              className='focus:border-blue-500'
            />
          </div>

          <div>
            <div className='relative'>
              <Input
                id='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                variant='bordered'
                required
                onChange={e => setPassword(e.target.value)}
                className='w-full border-gray-300 focus:border-blue-500'
              />
              <button
                type='button'
                onClick={handlePasswordToggle}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
              >
                {showPassword ? (
                  <EyeSlashIcon className='w-5 h-5' />
                ) : (
                  <EyeIcon className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            color='primary'
            className='w-full bg-blue-500 hover:bg-blue-600'
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className='my-6 border-t border-gray-300'></div>

        <p className='mt-6 text-sm text-center text-gray-600'>
          Forgot your password?{' '}
          <Link
            href='/auth/request-reset-password'
            className='text-blue-500 hover:underline'
          >
            Reset it here
          </Link>
          <span> | </span>
          Don&apos;t have an account?{' '}
          <Link href='/auth/register' className='text-blue-500 hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
    </>
  )
}
