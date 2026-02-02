import { FixturesList } from '@/components/ui/FixturesList';
import { Countdown } from '@/components/ui/Countdown';
import { containerClassName } from '@/lib/utils';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pb-12">
      <Countdown />
      <div className={containerClassName}>
        <FixturesList />
      </div>
    </main>
  );
}
