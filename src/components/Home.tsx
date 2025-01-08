'use client';

import React from 'react';
import { FiGlobe, FiLink, FiSmartphone } from 'react-icons/fi';
import Link from 'next/link';
import { QRCodePreview } from './QRCodePreview';
import { siteConfig } from '@/config/site.config';
import ClientOnly from './ClientOnly';

const dummyQRCodes = [
  {
    title: 'Website URL',
    icon: <FiGlobe className="w-6 h-6" />,
    description: 'Create QR codes for your website or landing page',
    color: 'bg-blue-500'
  },
  {
    title: 'Social Media',
    icon: <FiLink className="w-6 h-6" />,
    description: 'Share your social media profiles instantly',
    color: 'bg-purple-500'
  },
  {
    title: 'Contact Info',
    icon: <FiSmartphone className="w-6 h-6" />,
    description: 'Share contact details with a simple scan',
    color: 'bg-green-500'
  }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-white"
      />

      {/* Content */}
      <div className="relative z-10 py-10">
        {/* Hero Section */}
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block text-blue-400">Ideas into QR Codes</span>
              </h1>
              <p className="mt-3 text-base text-gray-800 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Create professional QR codes in seconds. Perfect for businesses, marketing campaigns, or personal use.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div className="rounded-md shadow">
                  <Link 
                    href="/new" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Create QR Code
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link 
                    href="/learn-more" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Create QR Codes for Everything
              </h2>
              <p className="mt-4 text-xl text-gray-800">
                Choose from multiple QR code types to suit your needs
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {dummyQRCodes.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-white border-opacity-20"
                  >
                    <div className={`${item.color} w-12 h-12 rounded-md flex items-center justify-center text-white mb-4`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    <p className="mt-2 text-base text-gray-800">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Home;
