import React, { RefObject } from 'react';

interface LargeQRCodeModalProps {
  isVisible: boolean; // Controls modal visibility
  closeModal: () => void; // Function to close modal
  qrRef: RefObject<HTMLDivElement>; // Reference for the QR container
  modalRef: RefObject<HTMLDivElement>; // Reference for the modal itself
}

const LargeQRCodeModal: React.FC<LargeQRCodeModalProps> = ({ isVisible, closeModal, qrRef, modalRef }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
        ref={modalRef}
      >
        <div
          ref={qrRef}
          className="mx-auto bg-gray-100 rounded-md"
          style={{ width: '300px', height: '300px' }}
        ></div>
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LargeQRCodeModal;
