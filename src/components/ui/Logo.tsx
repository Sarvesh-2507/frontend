import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  width = 120,
  height = 30
}) => {
  return (
    <img
      src="/mh-cognition-logo.svg"
      alt="MH Cognition Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default Logo;
