import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
