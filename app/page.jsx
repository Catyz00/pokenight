import { Hero } from '@/components/hero';
import { News } from '@/components/news';
import { Streamers } from '@/components/streamers';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Streamers />
      <News />
    </>
  );
}
