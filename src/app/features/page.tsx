'use client';

import Footer from '@/components/Footer';
import React from 'react';
import { FiZap, FiSmartphone, FiDownload, FiEdit2, FiShield, FiBarChart } from 'react-icons/fi';

const features = [
  {
    icon: <FiZap className="w-6 h-6" />,
    title: 'Instant Generation',
    description: 'Create QR codes in seconds with our lightning-fast generator. No technical knowledge required.',
    color: 'bg-blue-500'
  },
  {
    icon: <FiSmartphone className="w-6 h-6" />,
    title: 'Mobile Friendly',
    description: 'Responsive QR codes that work perfectly on all devices and scan seamlessly.',
    color: 'bg-green-500'
  },
  {
    icon: <FiDownload className="w-6 h-6" />,
    title: 'Multiple Formats',
    description: 'Download your QR codes in various formats including PNG, SVG, and PDF.',
    color: 'bg-purple-500'
  },
  {
    icon: <FiEdit2 className="w-6 h-6" />,
    title: 'Customization',
    description: 'Personalize your QR codes with custom colors, logos, and designs.',
    color: 'bg-orange-500'
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: 'Secure & Reliable',
    description: 'Your data is safe with us. We use industry-standard encryption.',
    color: 'bg-red-500'
  },
  {
    icon: <FiBarChart className="w-6 h-6" />,
    title: 'Analytics',
    description: 'Track your QR code scans and analyze performance with detailed insights.',
    color: 'bg-teal-500'
  }
];

export default function Features() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Powerful <span className="text-blue-600">Features</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Everything you need to create, manage, and track your QR codes in one place.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className={`inline-flex p-3 ${feature.color} rounded-lg text-white mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto mt-20 text-center">
        <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Create your first QR code in seconds. No signup required.
            </p>
            <div className="mt-8">
              <a
                href="/new"
                className="inline-block bg-white px-8 py-3 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                Create QR Code
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
