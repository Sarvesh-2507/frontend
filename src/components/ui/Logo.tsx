import React from 'react';
import { useThemeStore } from '../../context/themeStore';

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
  const { isDark } = useThemeStore();

  // Use dark theme logo for dark mode, light theme logo for light mode
  const logoSrc = isDark
    ? "/mh_cognition_cover-removebg-preview.png"  // Dark theme logo
    : "/mh_cognition_logo-removebg-preview.png";  // Light theme logo

  return (
    <img
      src={logoSrc}
      alt="MH Cognition Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default Logo;
