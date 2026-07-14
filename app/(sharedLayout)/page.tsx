import { Countdown } from '@/components/features/Countdown';
import { FixturesList } from '@/components/features/FixturesList';

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
