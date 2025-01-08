'use client'
import Header from '@/components/Header'
import Confirm from '@/components/Confirm'
import { deleteQr, fetchDashboard, fetchUserQrCodes } from '@/utils/apiHandlers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef, Suspense } from 'react'
import QRCodeStyling from 'qr-code-styling'
import useOutsideClick from '@/utils/documentOutSideClick'
import ScanModal from '@/components/common/ScanModal'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Pagination } from '@nextui-org/react'
import RecentActivity from '@/components/dashboard/RecentActivity'
import UsageGraph from '@/components/dashboard/UsageGraph'
import { useAppContext } from '@/context/useContext'
import QRCodeCard from '@/components/QRCodeCard'
import LargeQRCodeModal from '@/components/LargeQRCodeModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import Link from 'next/link'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedQr, setSelectedQr] = useState<any>(null)
  const [selectedQRCode, setSelectedQRCode] = useState<any>(null)
  const [selectedScan, setSelectedScan] = useState<any | null>(null)

  const [largeQRCode, setLargeQRCode] = useState<any>(null)
  const [qrCodes, setQrCodes] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [qrIdForDelete, setQrIdForDelete] = useState("")
  const [currentPage, setCurrentPage] = useState(1) // Manage current page state
  const itemsPerPage = 6 // Set the number of items per page

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginatedQRs = dashboardData?.qrCodes?.slice(startIndex, endIndex) || [] // Get the QR codes for the current page

  // const totalPages = Math.ceil((dashboardData?.qrCodes?.length || 0) / itemsPerPage); // Total number of pages

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page) // Update current page state
    fetchQrCodes(page) // Fetch QR codes for the selected page
  }

  const didFetchRef = useRef(false)
  const LarageQrRef = useRef(null)
  const qrCodeRefs = useRef<Array<HTMLDivElement | null>>([])
  const largeQRRef = useRef<HTMLDivElement | null>(null)
  const closeModalRef = useRef(null)
  const closeOptions = useRef(null)

  const { setDemoHistory } = useAppContext()

  useOutsideClick(LarageQrRef, () => setLargeQRCode(null))
  useOutsideClick(closeModalRef, () => setSelectedScan(null))
  useOutsideClick(closeOptions, () => setSelectedQRCode(null))

  const handleOpenScanModal = (scanData: any) => {
    setSelectedScan(scanData) 
  }

  const handleCloseScanModal = () => {
    setSelectedScan(null) // Close modal by resetting selectedScan state
  }

  const handleViewLargeQR = (qrCode: any, index: number) => {
    const qrCodeInstance = new QRCodeStyling({
      ...qrCode?.qrOptions,
      width: 300,
      height: 300
    })

    setLargeQRCode({ qrCode, qrCodeInstance })
  }

  // Fetch QR codes with pagination
  const fetchQrCodes = async (page: number) => {
    try {
      setLoading(true)
      const response: any = await fetchUserQrCodes(page, 6) // Fetch 10 QR codes per page
      if (response?.success) {
        setQrCodes(response?.data?.qrCodes);
        // console.log("response data qr", response?.data?.qrCodes)
        setTotalPages(response?.data?.pagination?.totalPages);
        setHasMore(page < response?.data?.pagination?.totalPages);

        
      }
    } catch (error: any) {
      console.error('Error fetching QR codes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQrCodes(1) // Fetch the first page of QR codes on load
  }, [])

  // Function to close large QR code view
  const closeLargeQR = () => setLargeQRCode(null)

  useEffect(() => {
    // Render the QR code in large view
    if (largeQRCode?.qrCodeInstance && largeQRRef.current) {
      largeQRCode.qrCodeInstance.append(largeQRRef.current)
    }
    return () => {
      if (largeQRRef.current) {
        largeQRRef.current.innerHTML = '' // Clear the large QR view
      }
    }
  }, [largeQRCode])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchDashboard()
        setDashboardData(response?.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (didFetchRef.current) return
    didFetchRef.current = true
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (qrCodes?.length > 0) {
      qrCodes.forEach((qrCode: any, index: number) => {
        const qrCodeInstance = new QRCodeStyling({
          ...qrCode?.qrOptions,
          width: 130,
          height: 130
        })

        if (qrCodeRefs.current[index]) {
          qrCodeInstance.append(qrCodeRefs.current[index])
        }
        return () => {
          if (qrCodeRefs.current[index]) {
            qrCodeRefs.current[index]!.innerHTML = '' // Clear the QR code DOM element
          }
        }
      })
    }
    return () => {
      qrCodeRefs.current.forEach(ref => {
        if (ref) {
          ref.innerHTML = '' // Clear the QR code from the DOM
        }
      })
    }
  }, [qrCodes])

 
  

  const handleDelete = async () => {
    try {
      // Call the deleteQr function and pass the QR code ID
      const response = await deleteQr(qrIdForDelete)

      if (response?.success) {
        // Update QR codes state to remove the deleted QR code
        setQrCodes((prevQrCodes: any[]) => 
          prevQrCodes.filter((item: any) => item._id !== qrIdForDelete)
        )

        // Update local storage to reflect the deletion
        const storedQrCodes = JSON.parse(localStorage.getItem('userQrCodes') || '[]')
        const updatedStoredQrCodes = storedQrCodes.filter((item: any) => item._id !== qrIdForDelete)
        localStorage.setItem('userQrCodes', JSON.stringify(updatedStoredQrCodes))

        // Add to demo history
        setDemoHistory((prevHistory: any[]) => [
          ...prevHistory,
          {
            id: response?.historyId || `demo-${Date.now()}`,
            description: `Deleted QR Code: ${selectedQr?.title || 'Untitled'}`,
            createdAt: new Date().toISOString()
          }
        ])

        // Reset states
        setShowConfirm(false)
        setSelectedQRCode(null)

        // Optional: Show success toast
        toast.success('QR Code deleted successfully')
      } else {
        console.error('Failed to delete QR code:', response?.message)
        toast.error('Failed to delete QR Code')
      }
    } catch (error) {
      console.error('Error deleting QR code:', error)
      toast.error('An error occurred while deleting QR Code')
    }
  }

  const handleShare = (qrCode: any) => {
    const shareUrl = qrCode?.targetUrl
    if (navigator.share) {
      navigator
        .share({
          title: 'QR Code',
          url: shareUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch(error => console.error('Error sharing:', error))
    } else {
      // Fallback logic for unsupported browsers
      navigator?.clipboard?.writeText(shareUrl.toString())
      alert('URL copied to clipboard!')
    }
    setSelectedQRCode(null) // Close dropdown
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="p-4 lg:p-8">
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <Skeleton height={24} width={200} />
            <Skeleton height={16} width={250} className="mt-2" />
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <Skeleton height={130} className="mb-4" />
                <Skeleton height={20} width={100} />
                <Skeleton height={16} width="80%" className="mt-2" />
              </div>
            ))}
          </section>
        </main>
      </div>
    )
  }


  return (
  <div className=" !h-full relative  !max-w-full flex flex-col">
      <Header />
      <main className='p-4 lg:p-8'>
        <section className='bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 truncate'>
                  {`Welcome back, ${session?.user?.name || session?.user?.email?.split('@')[0].replace(/\d+/g, '') || 'User'}`}
                </h2>
                <div className='hidden sm:flex items-center'>
                  <span className='h-2 w-2 bg-green-500 rounded-full animate-pulse'></span>
                </div>
              </div>
              <p className='text-sm sm:text-base text-gray-400 mt-1 sm:mt-2'>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
              <Link 
                href='/profile'
                className='flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 group'
              >
                <span className='text-sm font-medium whitespace-nowrap'>Profile</span>
                <svg 
                  className='w-4 h-4 transform group-hover:translate-x-0.5 transition-transform' 
                  fill='none' 
                  stroke='currentColor' 
                  viewBox='0 0 24 24'
                >
                  <path 
                    strokeLinecap='round' 
                    strokeLinejoin='round' 
                    strokeWidth={2} 
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </Link>
              <Link 
                href='/new'
                className='flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-all duration-200 group'
              >
                <span className='text-sm font-medium whitespace-nowrap'>Create QR</span>
                <svg 
                  className='w-4 h-4 transform group-hover:translate-x-0.5 transition-transform' 
                  fill='none' 
                  stroke='currentColor' 
                  viewBox='0 0 24 24'
                >
                  <path 
                    strokeLinecap='round' 
                    strokeLinejoin='round' 
                    strokeWidth={2} 
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className='mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4'>
            <div className='flex items-center gap-1.5 text-xs sm:text-sm text-gray-600'>
              <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>Last activity: Today</span>
            </div>
            <div className='flex items-center gap-1.5 text-xs sm:text-sm text-gray-600'>
              <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>All systems operational</span>
            </div>
          </div>
        </section>

        <section className='flex flex-col items-center justify-center w-full py-2 my-4'>
          <Suspense fallback={<LoadingSpinner />}>
            <UsageGraph data={dashboardData?.graphData} />
          </Suspense>

          <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full px-0 mt-4'>
            {qrCodes.map((qrCode: any, index: number) => (
              <QRCodeCard
                key={qrCode._id}
                qrCode={qrCode}
                setQrIdForDelete={setQrIdForDelete}
                qrPreview={(el: any) => (qrCodeRefs.current[index] = el)}
                index={index}
                handleViewLargeQR={handleViewLargeQR}
                handleOpenScanModal={handleOpenScanModal}
                handleShare={handleShare}
                setSelectedQRCode={setSelectedQRCode}
                selectedQRCode={selectedQRCode}
                closeOptions={closeOptions}
                setShowConfirm={setShowConfirm}
              />
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className='flex justify-center mt-8'>
              <Pagination total={totalPages} initialPage={currentPage} onChange={handlePageChange} />
            </section>
          )} 
        </section>

        <div className="mt-8">
          <RecentActivity />
        </div>

        <ScanModal qrCodeId={selectedScan?._id} totalScans={selectedScan?.scanCount} isOpen={!!selectedScan} closeModal={handleCloseScanModal} closeModalRef={closeModalRef} />
        <LargeQRCodeModal isVisible={!!largeQRCode} closeModal={closeLargeQR} qrRef={largeQRRef} modalRef={LarageQrRef} />
      </main>

      {/* Confirmation Dialog */}
      <Confirm
        isOpen={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        message={`Are you sure you want to delete the QR Code "${
          selectedQr?.title || 'Untitled'
        }"?`} />
    </div>
  )
}

export default Dashboard
