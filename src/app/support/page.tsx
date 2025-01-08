'use client'

import React from 'react'
import { FiHelpCircle, FiBook, FiMail } from 'react-icons/fi'
import { siteConfig } from '@/config/site.config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const supportOptions = [
  {
    icon: <FiHelpCircle className="w-8 h-8" />,
    title: 'Help Center',
    description: 'Browse through our comprehensive help articles and guides.',
    color: 'bg-blue-500',
  },
  {
    icon: <FiBook className="w-8 h-8" />,
    title: 'Documentation',
    description: 'Detailed technical documentation and API references.',
    color: 'bg-purple-500',
  },
  {
    icon: <FiMail className="w-8 h-8" />,
    title: 'Email Support',
    description: `${siteConfig.email} - Response within 24 hours.`,
    color: 'bg-green-500',
  }
]

const commonQuestions = [
  {
    question: 'How do I create my first QR code?',
    answer: 'Navigate to the Create QR section, choose your QR type, and follow our step-by-step guide.'
  },
  {
    question: 'What types of QR codes can I create?',
    answer: 'You can create QR codes for websites, text, vCards, emails, phone numbers, and more.'
  },
  {
    question: 'Are the QR codes permanent?',
    answer: 'Yes, once generated, your QR codes will work permanently unless you specifically delete them.'
  }
]

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900">Support Center</h1>
            <p className="mt-4 text-lg text-gray-600">How can we help you today?</p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`${option.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>

          {/* Common Questions */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {commonQuestions.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow">
                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-4">Contact our support team at</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
