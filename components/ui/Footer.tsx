'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Trophy, TableProperties, User } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const navItems = [
    {
      label: 'Partidos',
      href: '/',
      icon: CalendarDays,
    },
    {
      label: 'Llaves/Grupos',
      href: '/standings',
      icon: TableProperties,
    },
    {
      label: 'Ranking',
      href: '/leaderboard',
      icon: Trophy,
    },
  ];

  return (
    <div className="sticky bottom-0 z-50">
      <div className="absolute inset-0 bg-black" />

      <nav className="pb-safe relative container mx-auto flex h-16 items-center justify-around">
        {/* pb-safe es para respetar el área del botón de iPhone X+ */}

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full w-full flex-col items-center justify-center transition-all duration-300 ${
                isActive ? 'text-green-400' : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              <div
                className={`relative rounded-xl p-1.5 transition-all ${
                  isActive ? 'bg-green-500/10' : ''
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                {/* Puntito brillante si está activo */}
                {isActive && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                )}
              </div>

              <span className="mt-1 text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
