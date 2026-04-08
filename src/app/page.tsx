import { WallCalendar } from '@/components/WallCalendar';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 flex py-4 sm:py-10 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] overflow-x-hidden">
      <WallCalendar />
    </main>
  );
}
