import { FixturesList } from '@/components/ui/FixturesList';
import { Countdown } from '@/components/ui/Countdown';
import { containerClassName } from '@/lib/utils';
import Header from '@/components/ui/Header';

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Countdown />
      <div className={containerClassName}>
        <FixturesList />
      </div>
    </main>
  );
}
