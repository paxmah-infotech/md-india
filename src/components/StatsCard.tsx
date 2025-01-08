import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardBody className="flex flex-row items-center gap-4 p-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}
