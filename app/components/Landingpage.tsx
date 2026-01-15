"use client"

import { Button } from "@/components/ui/button"
import { Music, Radio, Users, Wand2 } from "lucide-react"
import { Appbar } from "@/app/components/Appbar"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const footerLinks = {
  product: [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Documentation', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { name: 'X', icon: FaXTwitter, href: '#' },
  { name: 'GitHub', icon: FaGithub, href: '#' },
  { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
  { name: 'Instagram', icon: FaInstagram, href: '#' },
];

export default function Landingpage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleStartStreaming = () => {
    if (session?.user) router.push("/streamspage")
    else router.push("/api/auth/signin")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Appbar />
      <section className="relative">
        <div className="absolute top-0 left-0 w-full z-0">
          <Image
            src="/hero_bg.jpg"
            alt="Hero background"
            width={2848}
            height={1784}
            className="w-[99%] mx-auto h-auto border rounded-md"
            quality={100}
            priority
          />
        </div>
        <div className="relative min-h-screen flex justify-center items-center z-10">
          <div className="mx-auto text-center space-y-8 max-w-5xl px-4 py-48">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm shadow-lg ring-1 ring-white/20">
              <Wand2 className="h-4 w-4" /> Vibe check: Passed.
            </span>
            <h1 className="font-primary text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-white px-4 drop-shadow-2xl">
              Where&nbsp;Your&nbsp;Audience
              <span className="block mt-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Became the&nbsp;DJ
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-white/90 leading-relaxed px-4 drop-shadow-lg">
              Build a stream where anyone can toss in YouTube tracks,
              vote up their faves, and shape the playlist live.
              It&apos;s like a house party — but the aux is shared.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-black shadow-2xl shadow-white/30 font-semibold hover:scale-105 transition-all duration-200"
                onClick={handleStartStreaming}
              >
                Start&nbsp;Streaming
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 font-semibold"
              >
                Join&nbsp;as&nbsp;Listener
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-72 px-28">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            {
              icon: <Radio className="h-7 w-7" />,
              title: "Create Your Stream",
              desc: "Spin up a room and set the vibe. Watch your community grow in seconds.",
            },
            {
              icon: <Music className="h-7 w-7" />,
              title: "Let Them Choose",
              desc: "Listeners up-vote songs and drive the playlist while you focus on the mix.",
            },
            {
              icon: <Users className="h-7 w-7" />,
              title: "Engage the Crowd",
              desc: "Chat, share reactions, and discover new tracks together — live.",
            },
          ].map((f, i) => (
            <article
              key={i}
              className="group relative overflow-hidden rounded-xl bg-white/5 p-10 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 border border-white/10"
            >
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),transparent_70%)]" />
              <div className="space-y-5">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-white/10 text-white">
                  {f.icon}
                </div>
                <h3 className="font-primary text-xl font-semibold">{f.title}</h3>
                <p className="text-white/70">{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative h-[200vh] bg-gradient-to-b from-black to-[#FF2A00]">
        <div className="container h-full flex items-center justify-center">
          <div className="text-center space-y-6 max-w-4xl px-4">
            <h2 className="font-primary text-5xl md:text-6xl font-bold text-white">
              Experience the Revolution
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Join thousands of creators transforming how music is shared and experienced.
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-black border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/rvb.jpeg"
                  alt="Reverb Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-md"
                />
                <span className="text-white font-bold text-lg tracking-tight">reverB</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                The platform for modern creators. Build, ship, and scale your audio projects with ease.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Product</h3>
              <ul className="flex flex-col gap-3 text-sm text-white/60">
                {footerLinks.product.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
              <ul className="flex flex-col gap-3 text-sm text-white/60">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Legal</h3>
              <ul className="flex flex-col gap-3 text-sm text-white/60">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} reverB Inc. All rights reserved.
            </span>

            <div className="flex items-center gap-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
