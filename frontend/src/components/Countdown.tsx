import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0');
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center space-x-4 text-2xl font-bold">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className="text-4xl">{formatTime(timeLeft.days)}</div>
            <div className="text-sm">дней</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-4xl">{formatTime(timeLeft.hours)}</div>
          <div className="text-sm">часов</div>
        </div>
        <div className="text-center">
          <div className="text-4xl">{formatTime(timeLeft.minutes)}</div>
          <div className="text-sm">минут</div>
        </div>
        <div className="text-center">
          <div className="text-4xl">{formatTime(timeLeft.seconds)}</div>
          <div className="text-sm">секунд</div>
        </div>
      </div>
    </div>
  );
};
