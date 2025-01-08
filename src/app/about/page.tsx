'use client';

import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
          <p className="mt-4 text-xl text-gray-500">
            We&apos;re dedicated to making QR codes more accessible and stylish.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <p className="mt-4 text-lg text-gray-500">
            Founded with a vision to revolutionize how businesses and individuals use QR codes,
            we&apos;ve been working tirelessly to create the most intuitive and powerful QR code
            generation platform available.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-500">
            To empower everyone to create beautiful, functional QR codes that enhance their
            digital presence while maintaining the highest standards of security and reliability.
          </p>
        </div>
      </div>
    </div>
  );
}
