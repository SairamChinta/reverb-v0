"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthButtons } from "./Authbutton";
import { Providers } from "../Providers";
import { Button } from "@/components/ui/button";

export function Appbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/streamspage");
    } else {
      router.push("/api/auth/signin"); // or replace with custom login page
    }
  };

  return (
    <header className="fixed top-0 w-full px-40 z-50 border-b bg-background/80 backdrop-blur-sm bg-pink text-white">
      <nav className="container flex h-16 items-center justify-between">
        <div className="italic text-3xl font-extrabold">
          <img src="/reverb-bg.png" alt="Logo" className="w-36 h-28" />
        </div>
        <div className="hidden md:flex gap-6">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Creators
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Listeners
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Providers>
            <AuthButtons />
          </Providers>
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>
      </nav>
    </header>
  );
}
