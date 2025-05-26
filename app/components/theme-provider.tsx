"use client"
//@ts-ignore
import { ThemeProvider as NextThemesProvider } from "next-themes"
//@ts-ignore
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

