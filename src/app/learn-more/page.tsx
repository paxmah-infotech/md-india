'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiZap, FiSmartphone, FiBarChart2 } from 'react-icons/fi'
import Header from '@/components/Header'

const features = [
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never store sensitive information.',
    icon: <FiShield className="h-6 w-6" />,
  },
  {
    title: 'Lightning Fast',
    description: 'Generate QR codes instantly with our optimized engine.',
    icon: <FiZap className="h-6 w-6" />,
  },
  {
    title: 'Mobile Friendly',
    description: 'QR codes are optimized for perfect scanning on all devices.',
    icon: <FiSmartphone className="h-6 w-6" />,
  },
  {
    title: 'Analytics Ready',
    description: 'Track scans and engagement with built-in analytics.',
    icon: <FiBarChart2 className="h-6 w-6" />,
  },
]

const useCases = [
  {
    title: 'Business Cards',
    description: 'Add QR codes to your business cards for quick contact sharing.',
  },
  {
    title: 'Marketing Materials',
    description: 'Enhance print materials with dynamic digital content.',
  },
  {
    title: 'Product Packaging',
    description: 'Link to product information, manuals, or registration pages.',
  },
  {
    title: 'Restaurant Menus',
    description: 'Create digital menus accessible via QR code scan.',
  },
]

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <div className="relative pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Learn More About Our
              <span className="block text-blue-600">QR Code Service</span>
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover how our QR code generator can help you connect the physical and digital worlds.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-blue-500 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Use Cases</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How You Can Use QR Codes
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-500">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Create your first QR code today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/new"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
