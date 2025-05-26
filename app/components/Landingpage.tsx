import { Button } from "@/components/ui/button"
//@ts-ignore
import { Music, Radio, Users, Wand2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Appbar } from "./Appbar"

export default function Landingpage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Appbar />

      {/* Hero Section */}
      <section className="container pt-32 pb-16">
        <div className="relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-25" />
          </div>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
              <Wand2 className="h-4 w-4 mr-2" />
              Transform your music streaming experience
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Where Music Meets
              <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Interactive Magic
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create unforgettable streaming experiences where your audience controls the playlist in real-time. Let
              your fans shape the music journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Start Streaming
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Join as Listener
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border p-8 hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Create Your Stream</h3>
              <p className="text-muted-foreground">
                Start your music stream and let your audience join in. Set the mood and watch your community grow.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border p-8 hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Choose the Music</h3>
              <p className="text-muted-foreground">
                Listeners can vote on songs and influence the playlist in real-time, creating a truly interactive
                experience.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border p-8 hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Engage Your Audience</h3>
              <p className="text-muted-foreground">
                Build a community around your music taste. Chat, share, and discover new tracks together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="container py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 blur-3xl opacity-25" />
        </div>
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Ready to Revolutionize Your
            <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Music Streaming?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the waitlist and be the first to experience the future of interactive music streaming.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="h-12 text-base" />
            <Button type="submit" size="lg" className="whitespace-nowrap">
              Join Waitlist
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="font-bold text-2xl italic">reverB</h1>
            <p className="text-sm text-muted-foreground">©2025 reverB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

