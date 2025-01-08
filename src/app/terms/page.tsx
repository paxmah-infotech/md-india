import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Terms</h2>
      <p className="mb-4">
        By accessing our website, you agree to be bound by these terms of service and comply
        with all applicable laws and regulations.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. Use License</h2>
      <p className="mb-4">
        Permission is granted to temporarily download one copy of the materials (information
        or software) on MD India&apos;s website for personal, non-commercial transitory viewing only.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. Disclaimer</h2>
      <p className="mb-4">
        The materials on MD India&apos;s website are provided on an &apos;as is&apos; basis.
        MD India makes no warranties, expressed or implied, and hereby disclaims and negates
        all other warranties including, without limitation, implied warranties or conditions
        of merchantability, fitness for a particular purpose, or non-infringement of
        intellectual property or other violation of rights.
      </p>
    </LegalLayout>
  );
}
