"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import StreamView from "../components/StreamView"
import 'react-toastify/dist/ReactToastify.css'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

export default function Component() {
  const { data: session, status } = useSession()
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user")
        if (!response.ok) throw new Error("Failed to fetch user")

        const data = await response.json()
        setCreatorId(data.user.id) // Assumes the API returns { user: { id: string } }
      } catch (e) {
        console.error("Error fetching user data:", e)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchUserData()
    }
  }, [status])

  if (loading || status === "loading") return <div>Loading...</div>
  if (!creatorId) return <div>Error: Unable to load user data</div>

  return <StreamView creatorId={creatorId} playVideo={true} />
}
