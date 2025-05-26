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
    <header className="bg-slate-800 fixed top-0 w-full px-40 z-50 border-b border-slate-700 bg-background/80 backdrop-blur-sm bg-pink text-white">
      <nav className="container flex h-16 items-center justify-between">
        <div className="italic text-3xl font-extrabold">
          <img src="/reverb-new.png" alt="Logo" className="w-40 h-34" />
        </div>
        <div className="flex items-center gap-4">
          <Providers>
            <AuthButtons />
          </Providers>
          <Button className="bg-purple-600 hover:bg-purple-700 transition-colors duration-200" onClick={handleGetStarted}>Get Started</Button>
        </div>
      </nav>
    </header>
  );
}
