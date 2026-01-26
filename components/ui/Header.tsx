'use client';
import { cn, containerClassName } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import { LogOutIcon, UserCircleIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from './DropdownMenu';

export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  return (
    <header className="sticky top-0 bg-black">
      <div
        className={cn(containerClassName, 'flex items-center justify-between gap-2 bg-black py-4')}
      >
        <h1 className="text-2xl font-bold tracking-tighter text-white italic">
          FUT<span className="text-green-500">POLLA</span>
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10! cursor-pointer">
              <AvatarImage src={user?.photoURL} alt="user-avatar" referrerPolicy="no-referrer" />
              <AvatarFallback>
                <UserCircleIcon />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              <LogOutIcon className="text-red-700" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
