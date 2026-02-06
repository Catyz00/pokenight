'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/home/hero';
import { News } from '@/components/home/news';
import { PageLoader } from '@/components/ui/page-loader';

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLoader rows={4} />
  }

  return (
    <>
      <Hero />
      <News />
    </>
  );
}
