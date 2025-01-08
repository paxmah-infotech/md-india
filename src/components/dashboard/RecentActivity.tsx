import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiMapPin, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState, useCallback, useRef, TouchEvent } from 'react';
import { getUserHistory, deleteHistory } from '@/utils/apiHandlers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  description: string;
  createdAt: string;
  type: string;
  metadata?: {
    ipAddress?: string;
    location?: string;
    userAgent?: string;
  };
}

interface RecentActivityProps {
  initialActivities?: Activity[];
}

export default function RecentActivity({ initialActivities = [] }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [loading, setLoading] = useState(!initialActivities.length);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [swipePosition, setSwipePosition] = useState(0);
  const touchStart = useRef<number>(0);
  const DELETE_THRESHOLD = -200; // Full swipe threshold
  const SPRING_THRESHOLD = -100; // Point of no return

  const fetchActivities = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!isMounted) return;
    
    try {
      setLoading(true);
      const response = await getUserHistory(pageNum, 10);
      if (response?.success && Array.isArray(response?.data?.history)) {
        const newActivities = response.data.history;
        setActivities(prev => append ? [...prev, ...newActivities] : newActivities);
        setHasMore(newActivities.length === 10);
        setPage(pageNum);
      }
    } catch (err) {
      setError('Failed to load recent activity');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [isMounted]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchActivities(page + 1, true);
  }, [fetchActivities, hasMore, loading, page]);

  const handleTouchStart = (e: TouchEvent, activityId: string) => {
    touchStart.current = e.touches[0].clientX;
    setSwipingId(activityId);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!swipingId) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStart.current;
    // Only allow left swipe
    const newPosition = Math.max(diff, DELETE_THRESHOLD);
    setSwipePosition(newPosition);
  };

  const handleTouchEnd = async () => {
    if (!swipingId) return;
    
    if (swipePosition <= SPRING_THRESHOLD) {
      // Delete immediately if swiped past spring threshold
      const activityToDelete = activities.find(a => a.id === swipingId);
      if (activityToDelete) {
        // Optimistically remove from UI
        setActivities(prev => prev.filter(activity => activity.id !== swipingId));
        // Delete from backend
        try {
          await deleteHistory(swipingId);
        } catch (err) {
          console.error('Error deleting activity:', err);
          // Revert on error
          setActivities(prev => [...prev, activityToDelete]);
        }
      }
    }
    
    // Reset swipe state
    setSwipePosition(0);
    setSwipingId(null);
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted && !initialActivities.length) {
      fetchActivities(1, false);
    }
  }, [fetchActivities, initialActivities.length, isMounted]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return '🔍';
      case 'create':
        return '➕';
      case 'delete':
        return '🗑️';
      case 'update':
        return '✏️';
      default:
        return '📝';
    }
  };

  const renderActivityItem = (activity: Activity) => (
    <motion.div
      key={activity.id}
      initial={{ opacity: 1, x: 0 }}
      exit={{ 
        opacity: 0,
        x: -300,
        transition: { 
          duration: 0.2,
          ease: [0.32, 0, 0.67, 0] // Fast out, slow in
        }
      }}
      layout
      className="relative"
    >
      <motion.div
        className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group touch-pan-y"
        style={{
          transform: swipingId === activity.id ? `translateX(${swipePosition}px)` : 'none',
          transition: swipingId === activity.id ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onTouchStart={(e) => handleTouchStart(e, activity.id)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.description}
          </p>
          {activity.metadata?.location && (
            <div className="flex items-center gap-2 mt-1">
              <FiMapPin className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 truncate">
                {activity.metadata.location}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock className="w-3 h-3" />
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={async () => {
              // Delete immediately without confirmation
              setActivities(prev => prev.filter(a => a.id !== activity.id));
              try {
                await deleteHistory(activity.id);
              } catch (err) {
                console.error('Error deleting activity:', err);
                // Revert on error
                setActivities(prev => [...prev, activity]);
              }
            }}
          >
            <FiTrash2 className="w-4 h-4 text-danger hover:text-danger-400" />
          </Button>
        </div>
      </motion.div>
      {/* Delete indicator background */}
      {swipingId === activity.id && swipePosition < 0 && (
        <div 
          className="absolute inset-y-0 right-0 bg-danger flex items-center justify-end px-4"
          style={{
            width: Math.abs(swipePosition),
            opacity: Math.min(Math.abs(swipePosition) / Math.abs(SPRING_THRESHOLD), 1)
          }}
        >
          <FiTrash2 className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );

  if (error) {
    return (
      <Card className="w-full shadow-sm">
        <CardBody className="text-center text-gray-500 py-8">
          {error}
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex gap-3 px-6 pt-6 pb-0">
        <div>
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <p className="text-sm text-gray-500">Latest actions and events</p>
        </div>
      </CardHeader>
      <CardBody className="px-3">
        <div 
          className="space-y-4 overflow-auto"
          id="activityScrollContainer"
          style={{ maxHeight: '500px' }}
        >
          {loading && activities.length === 0 ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No recent activity</p>
          ) : (
            <InfiniteScroll
              dataLength={activities.length}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={
                <div className="py-4 text-center text-gray-500">
                  Loading more activities...
                </div>
              }
              scrollableTarget="activityScrollContainer"
            >
              <AnimatePresence mode="popLayout">
                {activities.map(renderActivityItem)}
              </AnimatePresence>
            </InfiniteScroll>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
