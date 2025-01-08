import { Card, CardBody } from '@nextui-org/react';
import { FiBarChart2, FiUsers, FiActivity, FiTrendingUp } from 'react-icons/fi';

interface StatsCardsProps {
  totalScans: number;
  totalQRCodes: number;
  activeQRCodes: number;
  conversionRate: number;
}

export default function StatsCards({ totalScans, totalQRCodes, activeQRCodes, conversionRate }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Scans',
      value: totalScans,
      icon: <FiBarChart2 className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total QR Codes',
      value: totalQRCodes,
      icon: <FiUsers className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active QR Codes',
      value: activeQRCodes,
      icon: <FiActivity className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
