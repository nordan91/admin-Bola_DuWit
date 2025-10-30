interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function ChevronDownIcon({ width = 24, height = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
      style={{ color }}
    >
      <path 
        d="M6 9L12 15L18 9" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}