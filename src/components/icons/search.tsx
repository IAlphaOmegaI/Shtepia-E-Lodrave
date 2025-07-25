export const SearchIcon = ({ className = "", height = 24, width = 24 }: { className?: string; height?: number; width?: number }) => (
  <svg 
    className={className}
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);