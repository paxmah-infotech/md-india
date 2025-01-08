import { useState, useEffect, useRef, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
import { deleteHistory, getUserHistory } from '@/utils/apiHandlers'
import { formatRelativeTime } from '@/lib/formatRelativeTime'
import { useAppContext } from '@/context/useContext'

const RecentActivity = () => {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(
    null
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const didFetchRef = useRef(false)
  const { demoHistory, setDemoHistory } = useAppContext()

  // Fetch user activity and set to context state
  const fetchActivities = useCallback(async () => {
    try {
      const data = await getUserHistory(page, 10)

      if (data?.data?.history?.length < 10) {
        setHasMore(false)
      }

      // Deduplicate the data before setting state
      setDemoHistory((prev: any) => {
        const combined = [...prev, ...data?.data?.history]
        const unique = Array.from(
          new Map(combined.map(item => [item.id, item])).values()
        )
        return unique
      })

      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    }
  }, [page, demoHistory, setDemoHistory])

  useEffect(() => {
    if (didFetchRef.current) return
    didFetchRef.current = true

    if (demoHistory.length === 0) {
      fetchActivities() // Fetch data if demoHistory is empty
    }
  }, [demoHistory])

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities])

  // Handle deletion of an activity
  const handleDelete = async (id: string) => {
    setDeletingActivityId(id) // Show loading state for the specific activity

    try {
      await deleteHistory(id)
      // Remove deleted activity from context state
      setDemoHistory((prev: any) =>
        prev.filter((activity: any) => activity.id !== id)
      )
    } catch (error) {
      console.error('Error deleting activity:', error)
      setErrorMessage('Failed to delete activity. Please try again.')
    } finally {
      setDeletingActivityId(null)
    }
  }

  return (
    <section className=' px-4 bg-gray-200 w-full rounded-2xl pt-4 rounded-b-none'>
      {/* Title */}
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>Recent Activity</h2>

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={demoHistory.length}
        next={fetchActivities}
        hasMore={hasMore}
        loader={<p className='text-gray-600'>Loading more...</p>}
        endMessage={<p className='text-gray-600'>No more activity to show</p>}
      >
        <ul className='space-y-4'>
          {/* Activity List */}
          {demoHistory?.map((activity: any, index: any) => (
            <motion.li
              key={activity?.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Card Component */}
              <div
                className='bg-white shadow-lg rounded-lg p-4 flex justify-between items-center'
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: '#f7fafc',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div>
                  <div className='font-semibold text-gray-900'>
                    {activity.description}
                  </div>
                  <p className='text-sm text-gray-600'>
                    {formatRelativeTime(activity.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(activity.id)}
                  className={`ml-auto p-2 h-8 w-8 flex items-center justify-center rounded-full ${
                    deletingActivityId === activity.id
                      ? 'animate-spin text-red-400'
                      : 'hover:bg-gray-200'
                  }`}
                  disabled={deletingActivityId === activity.id}
                >
                  {deletingActivityId === activity.id ? (
                    <svg
                      className='w-5 h-5 text-red-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <circle cx='12' cy='12' r='10' strokeWidth='2'></circle>
                    </svg>
                  ) : (
                    <span className='text-red-600 font-bold text-2xl'>×</span>
                  )}
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </InfiniteScroll>

      {/* Error Notification */}
      {errorMessage && (
        <div
          className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg'
          onAnimationEnd={() => setErrorMessage(null)} // Auto close after animation
        >
          {errorMessage}
        </div>
      )}
    </section>
  )
}

export default RecentActivity
