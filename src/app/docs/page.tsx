'use client';

import Footer from '@/components/Footer';
import React from 'react';
import { FiBook, FiCode, FiCpu, FiDatabase, FiLayers, FiSettings } from 'react-icons/fi';

const docs = [
  {
    icon: <FiBook className="w-6 h-6" />,
    title: 'Getting Started',
    description: 'Learn the basics of QRStyle and create your first QR code.',
    color: 'bg-blue-500'
  },
  {
    icon: <FiCode className="w-6 h-6" />,
    title: 'API Reference',
    description: 'Comprehensive API documentation for developers.',
    color: 'bg-green-500'
  },
  {
    icon: <FiCpu className="w-6 h-6" />,
    title: 'SDK Integration',
    description: 'Integrate QRStyle into your applications.',
    color: 'bg-purple-500'
  },
  {
    icon: <FiDatabase className="w-6 h-6" />,
    title: 'Data Management',
    description: 'Learn about QR code data types and storage.',
    color: 'bg-orange-500'
  },
  {
    icon: <FiLayers className="w-6 h-6" />,
    title: 'Advanced Features',
    description: 'Explore advanced QR code customization options.',
    color: 'bg-red-500'
  },
  {
    icon: <FiSettings className="w-6 h-6" />,
    title: 'Configuration',
    description: 'Configure QRStyle for your specific needs.',
    color: 'bg-teal-500'
  }
];

export default function Documentation() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Documentation & <span className="text-blue-600">Guides</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Everything you need to know about using QRStyle effectively.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Documentation Grid */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className={`inline-flex p-3 ${doc.color} rounded-lg text-white mb-5`}>
                    {doc.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600">
                    {doc.description}
                  </p>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 w-full ${doc.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-7xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <a href="#" className="group">
                  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Installation Guide</h3>
                    <p className="text-sm text-gray-600 mt-1">Get started with QRStyle</p>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">API Documentation</h3>
                    <p className="text-sm text-gray-600 mt-1">Explore our API endpoints</p>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Best Practices</h3>
                    <p className="text-sm text-gray-600 mt-1">Learn QR code best practices</p>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">FAQs</h3>
                    <p className="text-sm text-gray-600 mt-1">Common questions answered</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
