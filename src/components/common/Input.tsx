import React from "react";

interface UrlInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const UrlInput: React.FC<UrlInputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded-md p-2 ${className || ""}`}
    />
  );
};

export default UrlInput;
