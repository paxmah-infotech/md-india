import Image from 'next/image';
import React from 'react';

interface LogoSelectorProps {
  selectedLogo: string | null;
  onLogoSelect: (logo: string | null) => void;
}

const LOGO_LIST = [
  'Famdent Logo.jpg',
  'In store asia logo.jpg',
  'MFI Logo - R.jpg',
  'Metec_India-4C.jpg',
  'ProWine Mumbai New Logo.png',
  'Tube India.jpg',
  'Valve World Expo India.jpg',
  'Welding & Cutting India.jpg',
  'glasspex INDIA.jpg',
  'glasspro INDIA.jpg',
  'wire India.jpg'
];

export const LogoSelector: React.FC<LogoSelectorProps> = ({ selectedLogo, onLogoSelect }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Logo Selection</h3>
      <div className="grid grid-cols-4 gap-4">
        <div
          className={`aspect-square border rounded-lg flex items-center justify-center cursor-pointer ${
            !selectedLogo ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onLogoSelect(null)}
        >
          <span className="text-sm text-gray-500">None</span>
        </div>
        {LOGO_LIST.map((logo, index) => (
          <div
            key={index}
            className={`aspect-square border rounded-lg p-2 cursor-pointer ${
              selectedLogo === logo ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onLogoSelect(logo)}
          >
            <Image
              src={`/qr_logo/${logo}`}
              width={100}
              height={100}
              alt={`Logo ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
