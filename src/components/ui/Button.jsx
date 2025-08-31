import React from "react";

export default function Button({
  children,
  size = "md",
  variant = "solid",
  className = "",
  ...props
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const base =
    "rounded-lg font-semibold shadow-sm inline-flex items-center justify-center";
  const variants = {
    solid:
      "bg-green-600 border-2 border-green-200 text-white hover:bg-primary-700",
    ghost: "bg-white border border-gray-200 text-primary-700 hover:bg-gray-50",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
