export const CloseIcon = ({ className = "", height = 24, width = 24 }: { className?: string; height?: number; width?: number }) => (
  <svg 
    className={className}
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);