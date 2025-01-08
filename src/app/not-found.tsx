// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden px-4">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-teal-500 to-blue-600 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      {/* Content */}
      <div className="z-10 text-center">
        <h1 className="text-[9rem] sm:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-purple-500 drop-shadow-2xl leading-none">
          404
        </h1>
        <p className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-200">
          Lost in Space?
        </p>
        <p className="mt-2 text-lg sm:text-xl text-gray-400 max-w-xl mx-auto">
          It seems the page you’re looking for is not here. Maybe it’s been moved, deleted, or never existed.
        </p>

        {/* Animated SVG Illustration */}
        <div className="mt-10">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
            <svg
              className="absolute w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16.88 3.549l.708-.705M21 10h2M3.549 7.12l-.708-.707M8 21h8m-1-7a4 4 0 10-6 0m10 0H3"></path>
            </svg>
          </div>
        </div>

        {/* Call to Action */}
        <Link
          href="/"
          className="mt-10 inline-block bg-gradient-to-r from-blue-500 via-teal-500 to-purple-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          Return to Homepage
        </Link> 
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-5 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} QRStyle. All rights reserved.
      </div>
    </div>
  );
}
