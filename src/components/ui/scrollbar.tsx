import cn from 'classnames';

type ScrollbarProps = {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

const Scrollbar: React.FC<ScrollbarProps> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('overflow-auto', className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Scrollbar;