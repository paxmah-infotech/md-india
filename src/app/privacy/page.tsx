import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';
import { siteConfig } from '@/config/site.config';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="mb-4">Last updated: January 8, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          At {siteConfig.name}, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our website and use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">We collect information that you provide directly to us, including:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Name and contact information</li>
          <li>Account credentials</li>
          <li>Payment information</li>
          <li>QR code data and metadata</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href={`mailto:${siteConfig.email}`} className="text-blue-600 hover:text-blue-800">
            {siteConfig.email}
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
