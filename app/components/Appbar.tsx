"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthButtons } from "./Authbutton";
import { Providers } from "../Providers";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Appbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/streamspage");
    } else {
      router.push("/api/auth/signin");
    }
  };

  return (
    <header className="bg-black fixed top-0 w-full px-40 z-50 border-b border-zinc-800 backdrop-blur-sm text-white">
      <nav className="container flex h-16 items-center justify-between">
        <div className="italic text-3xl font-extrabold">
          <Image
            src="/rvb.jpeg"
            alt="Logo"
            width={150}
            height={25}
          />
        </div>
        <div className="flex items-center gap-4">
          <Providers>
            <AuthButtons />
          </Providers>
          <Button className="bg-white hover:bg-gray-100 text-black transition-colors duration-200 font-semibold" onClick={handleGetStarted}>Get Started</Button>
        </div>
      </nav>
    </header>
  );
}
