'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'

interface AppContextType {
  isLoading: boolean
  error: string | null
  newQr: any
  setNewQr: any
  demoHistory:any
  setDemoHistory:any 
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [newQr, setNewQr] = useState<string>('')
  const [demoHistory, setDemoHistory] = useState([])

  return (
    <AppContext.Provider
      value={{
        isLoading,
        error,
        newQr,
        setNewQr,
        demoHistory,
        setDemoHistory
      }}
    >
      <div className='flex bg-gray-100 flex-col h-screen'>{children}</div>
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
