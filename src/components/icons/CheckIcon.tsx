interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function CheckIcon({ width = 24, height = 24, color = 'currentColor', className = '' }: IconProps) {
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
        d="M20 6L9 17L4 12" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}