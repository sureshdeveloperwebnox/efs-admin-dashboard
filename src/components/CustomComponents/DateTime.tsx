'use client';

import { useEffect, useState } from 'react';

interface DateTimeProps {
  format?: 'datetime' | 'date' | 'time';
  showSeconds?: boolean;
  className?: string;
  refreshInterval?: number; // in milliseconds (set 0 for no refresh)
}

export default function DateTime({
  format = 'datetime',
  showSeconds = false,
  className = '',
  refreshInterval = 1000
}: DateTimeProps) {
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      setCurrent(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatDate = () => {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const formatTime = () => {
    const hours = String(current.getHours()).padStart(2, '0');
    const minutes = String(current.getMinutes()).padStart(2, '0');
    const seconds = showSeconds ? `:${String(current.getSeconds()).padStart(2, '0')}` : '';
    
    return `${hours}:${minutes}${seconds}`;
  };

  const getFormattedValue = () => {
    switch (format) {
      case 'date': return formatDate();
      case 'time': return formatTime();
      default: return `${formatDate()} ${formatTime()}`;
    }
  };

  return (
    <span className={className}>
      {getFormattedValue()}
    </span>
  );
}