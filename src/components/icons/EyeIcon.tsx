interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function EyeIcon({ width = 24, height = 24, color = 'currentColor', className = '' }: IconProps) {
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
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}