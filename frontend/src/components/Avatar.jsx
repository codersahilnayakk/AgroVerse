import React from 'react';

const Avatar = ({ name, image, size = 'md', className = '' }) => {
  // Generate background color based on name
  const getColor = (name) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    
    if (!name) return colors[0];
    
    // Use the sum of char codes to determine color
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Determine size classes
  const sizeClasses = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-md',
    'lg': 'w-12 h-12 text-lg',
    'xl': 'w-16 h-16 text-xl'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  if (image) {
    return (
      <img 
        src={image} 
        alt={name || 'User'} 
        className={`rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }
  
  return (
    <div 
      className={`${getColor(name)} ${sizeClass} rounded-full flex items-center justify-center text-white font-medium ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar; 