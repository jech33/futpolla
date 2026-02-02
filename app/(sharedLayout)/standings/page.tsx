import { StandingsList } from '@/components/ui/StandingsList';
import { cn, containerClassName } from '@/lib/utils';

export default function StandingsPage() {
  return (
    <main className={cn(containerClassName, 'pb-12')}>
      <h2 className="my-6 text-3xl font-bold">Groups Stage</h2>
      <StandingsList />
    </main>
  );
}
