import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <p className="mb-4">Last updated: January 8, 2025</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">What are cookies?</h2>
      <p className="mb-4">
        Cookies are small text files that are placed on your computer or mobile device when you visit our website.
        They help us provide you with a better experience and understand how you use our service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">How we use cookies</h2>
      <p className="mb-4">
        We use cookies for the following purposes:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>To keep you signed in</li>
        <li>To remember your preferences</li>
        <li>To understand how you use our website</li>
        <li>To improve our service</li>
      </ul>
    </LegalLayout>
  );
}
