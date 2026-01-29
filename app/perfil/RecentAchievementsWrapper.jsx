"use client";
import { useEffect, useState } from 'react'
import RecentAchievements from '@/components/profile/RecentAchievements'

export default function RecentAchievementsWrapper({ characterName }) {
  const [storages, setStorages] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!characterName) return
    setLoading(true)
    fetch(`/api/characters/storages?character=${encodeURIComponent(characterName)}`)
      .then(res => res.json())
      .then(data => {
        setStorages(data.storages || {})
        setLoading(false)
      })
      .catch(() => {
        setStorages({})
        setLoading(false)
      })
  }, [characterName])

  if (loading) return <div className="text-center text-muted-foreground py-8">Carregando conquistas...</div>
  return <RecentAchievements storages={storages} />
}
