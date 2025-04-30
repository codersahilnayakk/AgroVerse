import React from 'react';

/**
 * Spinner component for loading states
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color of the spinner (defaults to green)
 */
function Spinner({ size = 'md', color = 'green' }) {
  // Size mapping
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };

  // Color mapping
  const colorMap = {
    green: 'border-green-700',
    blue: 'border-blue-700',
    red: 'border-red-700',
    gray: 'border-gray-700'
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.green;
  
  // If used inline, don't add margin
  const marginClass = size === 'sm' ? '' : 'my-10';

  return (
    <div className={`flex justify-center items-center ${marginClass}`}>
      <div className={`animate-spin rounded-full ${sizeClass} border-b-2 ${colorClass}`}></div>
    </div>
  );
}

export default Spinner; 