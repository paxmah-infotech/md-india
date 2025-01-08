'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiFileText, FiTable, FiFile } from 'react-icons/fi'
import { exportUserData, ExportFormat } from '@/services/exportService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ExportPage () {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel')

  const exportFormats = [
    {
      id: 'excel',
      name: 'Excel (.xlsx)',
      icon: FiTable,
      color: 'bg-green-500',
      description: 'Export as spreadsheet with multiple sheets for QR codes and scan logs',
      local: true,
      enabled: true
    },
    {
      id: 'pdf',
      name: 'PDF (.pdf)',
      icon: FiFileText,
      color: 'bg-red-500',
      description: 'Detailed PDF report with QR code images and analytics',
      local: true,
      enabled: true
    },
    {
      id: 'json',
      name: 'JSON (.json)',
      icon: FiFile,
      color: 'bg-blue-500',
      description: 'Raw data export in JSON format for developers',
      local: false,
      enabled: false
    }
  ]

  const handleExport = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const fileName = `QRData_${new Date().toISOString()}_${
        session?.user?.name || 'user'
      }`
      await exportUserData({
        format: selectedFormat,
        fileName: `${fileName}.${
          selectedFormat === 'excel' ? 'xlsx' : selectedFormat
        }`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-lg shadow-xl overflow-hidden'
          >
            {/* Header */}
            <div className='px-6 py-8 border-b border-gray-200'>
              <h1 className='text-3xl font-bold text-gray-900'>
                Export QR Data
              </h1>
              <p className='mt-2 text-gray-600'>
                Download your QR codes, scan history, and analytics in your
                preferred format.
              </p>
            </div>

            {/* Format Selection */}
            <div className='px-6 py-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                Select Export Format
              </h2>
              <div className='grid grid-cols-1 gap-4'>
                {exportFormats.filter(format => format.enabled).map(format => (
                  <motion.button
                    key={format.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedFormat(format.id as ExportFormat)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-start space-x-4'>
                      <div
                        className={`w-12 h-12 rounded-full ${format.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <format.icon className='w-6 h-6 text-white' />
                      </div>
                      <div className='flex-grow text-left'>
                        <div className='flex items-center space-x-2'>
                          <p className='font-medium text-gray-900'>{format.name}</p>
                          <span className={`px-2 py-1 text-xs rounded ${format.local ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {format.local ? 'Local' : 'Online'}
                          </span>
                        </div>
                        <p className='mt-1 text-sm text-gray-600'>{format.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <div className='px-6 py-6 bg-gray-50'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={loading}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <FiDownload className='w-5 h-5 mr-2' />
                {loading ? 'Exporting...' : 'Export Data'}
              </motion.button>
            </div>

            {/* Info Section */}
            <div className='px-6 py-4 bg-blue-50 border-t border-blue-100'>
              <h3 className='text-sm font-medium text-blue-800'>
                What&apos;s included in the export?
              </h3>
              <ul className='mt-2 text-sm text-blue-700 list-disc list-inside'>
                <li>All your QR codes with their settings and designs</li>
                <li>Scan history and analytics</li>
                <li>User profile information</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
