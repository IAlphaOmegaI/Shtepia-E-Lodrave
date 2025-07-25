export const MapPin = ({ className = "", height = 24, width = 24 }: { className?: string; height?: number; width?: number }) => (
  <svg 
    className={className}
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const MapPinNew = ({ className = "", height = 24, width = 24 }: { className?: string; height?: number; width?: number }) => (
  <svg 
    className={className}
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);