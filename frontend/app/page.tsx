"use client"

import { useState } from "react"
import StartupScreen from "@/app/components/StartupScreen"
//import {ChatUI} from "@/app/components/ultimateHaiku/ChatUI"
import {ChatUI} from "@/app/components/internals/ChatUI"

export default function Home() {
  const [started, setStarted] = useState(false)

  return (
    <main className="h-screen w-full">
      {!started ? <StartupScreen onStart={() => setStarted(true)} /> : <ChatUI />}
    </main>
  )
}
