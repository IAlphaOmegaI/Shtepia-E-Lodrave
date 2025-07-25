import React, { useEffect, useState } from 'react';
import cn from 'classnames';

interface CountdownTimerProps {
  date: Date;
  className?: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  date,
  className,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +date - +new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date, onComplete]);

  return (
    <div className={cn('flex gap-2', className)}>
      <p>{timeLeft.days}d</p>
      <p>{timeLeft.hours}h</p>
      <p>{timeLeft.minutes}m</p>
      <p>{timeLeft.seconds}s</p>
    </div>
  );
};

export default CountdownTimer;