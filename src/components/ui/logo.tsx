import Link from 'next/link';
import Image from 'next/image';
import { Routes } from '@/config/routes';
import cn from 'classnames';

interface LogoProps {
  className?: string;
  href?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  href = Routes.home,
  ...props
}) => {
  return (
    <Link
      href={href}
      className={cn('inline-flex', className)}
      {...props}
    >
      <span className="text-2xl font-bold text-white">
          <Image src="/assets/logo.png" alt="logo" width={150} height={100} />
      </span>
      {/* Replace with actual logo image when available */}
    </Link>
  );
};

export default Logo;