import { FixturesList } from '@/components/ui/FixturesList';
import { Countdown } from '@/components/ui/Countdown';
import { cn, containerClassName } from '@/lib/utils';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Countdown />
      <div className={cn(containerClassName, 'flex flex-1 flex-col')}>
        <FixturesList />
      </div>
    </main>
  );
}
