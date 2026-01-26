'use client';
import { useEffect, useState } from 'react';

export const NextHydrationWaiter = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return <>{isHydrated ? <div>{children}</div> : null}</>;
};
