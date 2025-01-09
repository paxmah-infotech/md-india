"use client"
import React from "react";
import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import { siteConfig } from '@/config/site.config';

const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Create QR", href: "/new" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Features", href: "/features" },
      ],
    },
    // {
    //   title: "Company",
    //   links: [
    //     { label: "About Us", href: "/about" },
    //     { label: "Contact", href: "/contact" },
    //     { label: "Privacy Policy", href: "/privacy" },
    //   ],
    // },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        // { label: "Blog", href: "/blog" },
        { label: "Support", href: "/support" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          {/* <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Create professional QR codes for your business and personal needs. Fast, easy, and reliable.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div> */}

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} QR Generator. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            {siteConfig.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
