interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function DirectAdminIcon({ width = 24, height = 24, color = 'currentColor', className = '' }: IconProps) {
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
        d="M4 12L10 6V9H20V15H10V18L4 12Z" 
        fill={color}
      />
      <path 
        d="M14 6L20 12L14 18V15H10V9H14V6Z" 
        fill={color}
        opacity="0.7"
      />
    </svg>
  );
}