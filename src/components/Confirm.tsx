import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";

type ConfirmProps = {
  isOpen: boolean;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
  message: string;
  showInput?: boolean;
  inputPlaceholder?: string;
};

const Confirm: React.FC<ConfirmProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  showInput = false,
  inputPlaceholder = "Type 'DELETE' to confirm",
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Reset scrolling
    }

    // Cleanup on unmount or isOpen change
    return () => {
      document.body.style.overflow = ""; // Ensure scrolling is restored
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (showInput && inputValue.toLocaleLowerCase() !== "delete") {
      alert("Please type 'DELETE' to confirm.");
      return;
    }
    onConfirm(inputValue); // Pass the input value when confirming
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onCancel}>
      <motion.div
        className="fixed inset-0 flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
        >
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Confirm Action
          </Dialog.Title>
          <p className="text-gray-600 dark:text-gray-300 text-base mb-6">{message}</p>

          {showInput && (
            <div className="mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder={inputPlaceholder}
                autoFocus
              />
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 font-medium"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Dialog.Root>
  );
};

export default Confirm;
