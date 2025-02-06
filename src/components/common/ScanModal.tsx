import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import {
  IoLocationSharp,
  IoTimeOutline,
  IoGlobeOutline,
  IoOpenOutline
} from 'react-icons/io5';
import {
  SiApple,
  SiAndroid,
  SiGooglechrome,
  SiFirefox,
  SiSafari,
  SiOpera,
  SiBrave,
  SiIos,
  SiLinux,
  SiUbuntu,
  SiMacos
} from 'react-icons/si';
import { FaWindows } from "react-icons/fa";
import { FaEdge } from "react-icons/fa";
import { HiDeviceMobile, HiDesktopComputer } from 'react-icons/hi';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface DeviceInfo {
  type: string;
  browser: string;
  os: string;
}

interface Location {
  city: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ScanData {
  _id: string;
  ip: string;
  userAgent: string;
  referer: string;
  timestamp: string;
  location: Location;
}

interface ScanModalProps {
  qrCodeId: any;
  isOpen: boolean;
  closeModal: () => void;
  closeModalRef?: React.RefObject<HTMLDivElement>;
  totalScans: number;
  textContent?: string | any
}

const formatUserAgent = (userAgent: string): DeviceInfo => {
  if (!userAgent) {
    return {
      type: 'Unknown Device',
      browser: 'Unknown Browser',
      os: 'Unknown OS'
    };
  }

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  const browser = /Chrome|Safari|Firefox|Edge/i.exec(userAgent)?.[0] || 'Unknown Browser';
  const os = /Windows|Mac|Linux|iOS|Android/i.exec(userAgent)?.[0] || 'Unknown OS';

  return {
    type: isMobile ? 'Mobile Device' : 'Desktop',
    browser,
    os
  };
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return format(date, 'h:mm a'); // Today at 2:30 PM
  } else if (diffInHours < 48) {
    return 'Yesterday at ' + format(date, 'h:mm a');
  } else {
    return format(date, 'MMM d, h:mm a'); // Dec 2, 2:30 PM
  }
};

const formatLocation = (location: Location): string => {
  if (!location.city && !location.country) return 'Unknown Location';
  if (!location.city) return location.country;
  return `${location.city}, ${location.country}`;
};

const getOSIcon = (os: string) => {
  const iconClass = "w-3.5 h-3.5";
  if (os.toLowerCase().includes('ios')) return <SiIos className={iconClass} />;
  if (os.toLowerCase().includes('mac')) return <SiMacos className={iconClass} />;
  if (os.toLowerCase().includes('windows')) return <FaWindows className={iconClass} />;
  if (os.toLowerCase().includes('android')) return <SiAndroid className={iconClass} />;
  if (os.toLowerCase().includes('linux')) return <SiLinux className={iconClass} />;
  if (os.toLowerCase().includes('ubuntu')) return <SiUbuntu className={iconClass} />;
  return <IoGlobeOutline className={iconClass} />;
};

const getBrowserIcon = (browser: string) => {
  const iconClass = "w-3.5 h-3.5";
  if (browser.toLowerCase().includes('chrome')) return <SiGooglechrome className={iconClass} />;
  if (browser.toLowerCase().includes('firefox')) return <SiFirefox className={iconClass} />;
  if (browser.toLowerCase().includes('safari')) return <SiSafari className={iconClass} />;
  if (browser.toLowerCase().includes('opera')) return <SiOpera className={iconClass} />;
  if (browser.toLowerCase().includes('edge')) return <FaEdge className={iconClass} />;
  if (browser.toLowerCase().includes('brave')) return <SiBrave className={iconClass} />;
  return <IoGlobeOutline className={iconClass} />;
};

const getDeviceIcon = (type: string) => {
  const iconClass = "w-3.5 h-3.5";
  return type.toLowerCase().includes('mobile') ?
    <HiDeviceMobile className={iconClass} /> :
    <HiDesktopComputer className={iconClass} />;
};

const openInMaps = (coordinates: { lat: number; lng: number }) => {
  const { lat, lng } = coordinates;
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
};

const ScanModal: React.FC<ScanModalProps> = ({
  qrCodeId,
  isOpen,
  closeModal,
  closeModalRef,
  totalScans,
  textContent
}) => {
  const [scanData, setScanData] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchScans = async (pageNum: number, isInitial: boolean = false) => {
    if (loading || (!hasMore && !isInitial)) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/scanlogs?qrCodeId=${qrCodeId}&page=${pageNum}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setScanData(prev => {
          if (isInitial) return data.data.scanLogs;
          return [...prev, ...data.data.scanLogs];
        });
        setHasMore(data.data.pagination.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading scans:', error);
    } finally {
      setLoading(false);
      if (isInitial) {
        setInitialLoading(false);
      }
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchScans(page + 1);
    }
  };

  useEffect(() => {
    if (isOpen && qrCodeId) {
      setInitialLoading(true);
      setScanData([]);
      setPage(1);
      setHasMore(true);
      fetchScans(1, true);
    }
  }, [isOpen, qrCodeId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-6"
    >
      <div
        ref={closeModalRef}
        className="relative w-full sm:w-[95%] max-w-2xl h-[85vh] sm:h-auto sm:max-h-[85vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 sm:p-6 border-b border-gray-200/30">
          <button
            onClick={closeModal}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Scan Activity</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalScans} total {totalScans === 1 ? 'scan' : 'scans'}
            </p>
            {textContent && <p className="text-sm text-gray-500 dark:text-gray-400">Description: <span className='text-gray-900'>{textContent}</span></p>}
          </div>
        </div>

        <div id="scanModalScrollable" className="h-[calc(85vh-4rem)] sm:h-auto sm:max-h-[calc(85vh-4rem)] overflow-y-auto overscroll-bounce">
          {initialLoading ? (
            <div className="flex flex-col justify-center items-center h-48 space-y-3">
              <Spinner size="lg" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading scan history...</p>
            </div>
          ) : scanData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No scan history available</p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={scanData.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center items-center py-4">
                  <Spinner color="default" size="sm" />
                </div>
              }
              scrollableTarget="scanModalScrollable"
              endMessage={
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  End of scan history
                </div>
              }
            >
              <div className="divide-y divide-gray-200/10 dark:divide-gray-700/30">
                {scanData.map((scan) => {
                  const device = formatUserAgent(scan.userAgent);
                  return (
                    <motion.div
                      key={scan._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => openInMaps(scan?.location?.coordinates)}
                              title='Open in Maps'
                              className="cursor-pointer group inline-flex items-center space-x-1.5 text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 dark:active:text-blue-500"
                            >
                              <IoLocationSharp className="w-3.5 h-3.5 text-red-500 dark:text-red-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                              <span className="truncate">{formatLocation(scan?.location)}</span>
                              <IoOpenOutline className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                            <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-gray-900 dark:text-white">
                              <IoGlobeOutline className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                              <span>{scan.ip}</span>
                            </div>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              {getOSIcon(device.os)}
                              <span className="hidden sm:inline">{device.os}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center space-x-1">
                              {getBrowserIcon(device.browser)}
                              <span className="hidden sm:inline">{device.browser}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                          <IoTimeOutline className="w-3.5 h-3.5" />
                          <time>{formatTime(scan.timestamp)}</time>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ScanModal;
