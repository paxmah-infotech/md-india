'use client'

import React from 'react'
import Image from 'next/image'
import { FiClock, FiTag, FiUser, FiCalendar } from 'react-icons/fi'
import { siteConfig } from '@/config/site.config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Format date in a consistent way
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const blogPosts = [
  {
    title: 'The Future of QR Codes in Digital Marketing',
    excerpt:
      'Discover how QR codes are revolutionizing digital marketing strategies and customer engagement in 2024.',
    author: 'John Doe',
    date: '2024-01-15',
    displayDate: formatDate('2024-01-15'),
    category: 'Marketing',
    image: '/assets/blog/marketing-qr.jpg',
    readTime: '5 min read',
    featured: true
  },
  {
    title: 'Best Practices for QR Code Design',
    excerpt:
      'Learn how to create effective and visually appealing QR codes that drive engagement and enhance user experience.',
    author: 'Jane Smith',
    date: '2024-01-12',
    displayDate: formatDate('2024-01-12'),
    category: 'Design',
    image: '/assets/blog/qr-design.jpg',
    readTime: '7 min read'
  },
  {
    title: 'QR Codes in Restaurant Menus: A Success Story',
    excerpt:
      'How restaurants are transforming their customer experience with dynamic QR code menus.',
    author: 'Mike Johnson',
    date: '2024-01-10',
    displayDate: formatDate('2024-01-10'),
    category: 'Industry',
    image: '/assets/blog/restaurant-qr.jpg',
    readTime: '4 min read'
  },
  {
    title: 'Security Best Practices for QR Codes',
    excerpt:
      'Essential security measures and guidelines to protect your QR codes from potential threats and misuse.',
    author: 'Sarah Wilson',
    date: '2024-01-08',
    displayDate: formatDate('2024-01-08'),
    category: 'Security',
    image: '/assets/blog/security-qr.jpg',
    readTime: '6 min read'
  }
]

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900">Latest Blog Posts</h1>
            <p className="mt-4 text-lg text-gray-600">
              Insights and updates from {siteConfig.name}
            </p>
          </div>

          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post, index) => (
            <div key={index} className="mb-16">
              <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={true}
                />
              </div>
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <FiCalendar className="mr-2" />
                    {post.displayDate}
                  </span>
                  <span className="flex items-center">
                    <FiUser className="mr-2" />
                    {post.author}
                  </span>
                  <span className="flex items-center">
                    <FiTag className="mr-2" />
                    {post.category}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-2" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h2>
                <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Read More
                </button>
              </div>
            </div>
          ))}

          {/* Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center mr-4">
                      <FiCalendar className="mr-2" />
                      {post.displayDate}
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-2" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-blue-600 font-semibold hover:text-blue-800">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
