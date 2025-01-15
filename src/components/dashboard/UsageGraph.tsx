import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UsageGraphProps {
  data?: {
    labels: string[];
    scans: number[];
  };
}

export default function UsageGraph({ data }: UsageGraphProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardHeader className="flex gap-2 sm:gap-3 px-3 sm:px-6 pt-4 sm:pt-6 pb-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Usage Analytics</h3>
            <p className="text-xs sm:text-sm text-gray-500">Loading scan data...</p>
          </div>
        </CardHeader>
        <CardBody className="px-2 sm:px-6 py-3 sm:py-4">
          <div className="animate-pulse">
            <div className="h-[250px] sm:h-[300px] bg-gray-100 rounded-lg"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const totalScans = data.scans.reduce((a, b) => a + b, 0);
  const maxScans = Math.max(...data.scans);
  const hasScans = totalScans > 0;

  const movingAverage = data.scans.map((_, index, array) => {
    if (index < 2) return null;
    const sum = array[index] + array[index - 1] + array[index - 2];
    return Number((sum / 3).toFixed(1));
  });

  const trend = data.scans.map((scan, index) => {
    if (index === 0) return null;
    const prevScan = data.scans[index - 1];
    if (prevScan === 0) return null;
    return Number(((scan - prevScan) / prevScan * 100).toFixed(1));
  });

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Daily Scans',
        data: data.scans,
        borderColor: '#0070F3',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0070F3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0070F3',
        yAxisID: 'y',
      },
      {
        label: '3-Day Average',
        data: movingAverage,
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'Daily Change %',
        data: trend,
        borderColor: '#F59E0B',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      }
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: isMobile ? 'start' : 'center' as const,
        labels: {
          usePointStyle: true,
          boxWidth: isMobile ? 4 : 6,
          boxHeight: isMobile ? 4 : 6,
          padding: isMobile ? 8 : 20,
          color: '#666',
          font: {
            size: isMobile ? 10 : 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: isMobile ? 8 : 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        bodySpacing: 4,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: {
          size: isMobile ? 10 : 12,
        },
        bodyFont: {
          size: isMobile ? 10 : 12,
        },
        callbacks: {
          title(tooltipItems) {
            return tooltipItems[0].label?.toString() || '';
          },
          label(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Daily Change %' && value !== null) {
              return `${label}: ${value}%`;
            }
            if (label === '3-Day Average' && value !== null) {
              return `${label}: ${value}`;
            }
            return `${label}: ${value} scan${value !== 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
            family: "'Inter', sans-serif",
          },
          color: '#666',
          padding: isMobile ? 4 : 8,
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: isMobile ? 6 : 12,
        },
      },
      y: {
        position: 'left',
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
            family: "'Inter', sans-serif",
          },
          color: '#666',
          padding: isMobile ? 4 : 8,
          stepSize: 1,
          callback(value) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return Number.isInteger(numValue) ? numValue : undefined;
          },
        },
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
            family: "'Inter', sans-serif",
          },
          color: '#F59E0B',
          padding: isMobile ? 4 : 8,
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <Card className="w-full bg-gray-100 shadow-md">
      <CardHeader className="flex gap-2 sm:gap-3 px-3 sm:px-6 pt-4 sm:pt-6 pb-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Usage Analytics</h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {hasScans 
              ? `Total Scans: ${totalScans} | Peak: ${maxScans} scans`
              : 'No scan data available'}
          </p>
        </div>
      </CardHeader>
      <CardBody className="px-2 sm:px-6 py-3 sm:py-4">
        <div className="h-[250px] sm:h-[300px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
}
