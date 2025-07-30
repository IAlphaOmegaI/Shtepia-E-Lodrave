export const ChevronUpIcon = ({
  width = 24,
  height = 24,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { width?: number; height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);