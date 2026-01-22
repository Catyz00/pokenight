import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { News } from '@/components/news'
import { Rankings } from '@/components/rankings'
import { Streamers } from '@/components/streamers'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Streamers />
        <News />
        <Rankings />
      </main>
      <Footer />
    </div>
  )
}
