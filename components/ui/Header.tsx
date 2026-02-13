'use client';
import { LogOutIcon, UserCircleIcon } from 'lucide-react';

import { cn, containerClassName } from '@/lib/utils';
import { logoutFirebase } from '@/services/authServices';
import { useAuthStore } from '@/stores/useAuthStore';

import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';

export default function Header() {
  const user = useAuthStore().firebaseUser;

  return (
    <header className="sticky top-0 z-2 bg-black">
      <div
        className={cn(containerClassName, 'flex items-center justify-between gap-2 bg-black py-4')}
      >
        <h1 className="text-2xl font-bold tracking-tighter text-white italic">
          FUT<span className="text-green-500">POLLA</span>
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10! cursor-pointer">
              <AvatarImage
                src={user?.photoURL || undefined}
                alt="user-avatar"
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                <UserCircleIcon />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" onClick={logoutFirebase}>
              <LogOutIcon className="text-red-700" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
