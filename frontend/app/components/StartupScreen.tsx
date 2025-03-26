"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface StartupScreenProps {
  onStart: () => void
}

export default function StartupScreen({ onStart }: StartupScreenProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div
        className={`max-w-3xl w-full px-6 py-12 text-center transition-all duration-1000 ease-in-out transform ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative mb-12 inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-indigo-500 rounded-lg blur opacity-30 dark:opacity-40 animate-pulse"></div>
          <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-2">
          Mukul Anand’s AI Assistant – Smarter, Faster, Better
          </h1>
        </div>

        <p
          className={`text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-12 transition-all duration-1000 delay-300 ease-in-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Built to simplify your life, this AI assistant listens, understands, and responds in real-time. From voice commands to intelligent insights, experience the future of productivity today.
        </p>

        <div
          className={`transition-all duration-1000 delay-500 ease-in-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            size="lg"
            onClick={onStart}
            className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start AI Assistant
              <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </div>
  )
}
