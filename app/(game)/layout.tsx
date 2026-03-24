import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { GameLayout } from '@/components/layout/GameLayout';

export default function GameGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <GameLayout>{children}</GameLayout>
      <Sidebar />
      <MobileNav />
    </>
  );
}
