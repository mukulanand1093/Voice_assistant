"use client"

import { useState, useRef, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageBubble } from "./MessageBubble"
//import { InputControls }   from "./InputControl"
//import { InputControls2 }   from "./InputControl2"
import { InputControls2 }   from "./InputControl2"

export type MessageType = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type: "text" | "image" | "audio"
  isLoading?: boolean
  mediaUrl?: string
}

export function ChatUI() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      type: "text",
    },
  ])

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (content: string, type: "text" | "image" | "audio" = "text", mediaUrl?: string) => {
    if ((type === "text" && content.trim() === "") || (type !== "text" && !mediaUrl)) return

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type,
      mediaUrl,
    }

    setMessages((prev) => [...prev, userMessage])

    // Show typing indicator
    setIsTyping(true)

    // Simulate AI response after a short delay or for audio
    const handleResponse = (responseContent: string, responseMediaUrl?: string) => {
      setIsTyping(false)

      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "ai",
        timestamp: new Date(),
        type: responseMediaUrl ? "audio" : "text",
        mediaUrl: responseMediaUrl,
      }

      setMessages((prev) => [...prev, aiMessage])
    }

    if (type === "audio") {
      // Simulate audio processing and response
      setTimeout(() => {
        handleResponse("I've received your audio message.", mediaUrl)
      }, 2000)
    } else {
      // Existing text/image message handling
      setTimeout(() => {
        let responseContent = "I'm an AI assistant. This is a simulated response to your message."

        if (type === "image") {
          responseContent = "Thanks for sharing this image! I can analyze it or provide feedback if you'd like."
        }

        handleResponse(responseContent)
      }, 2000)
    }
  }

  return (
    <div className={cn("flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200")}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">VoiceFlow AI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-full">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <MessageBubble
            message={{
              id: "typing",
              content: "",
              sender: "ai",
              timestamp: new Date(),
              type: "text",
              isLoading: true,
            }}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <InputControls2 onSendMessage={handleSendMessage} />
    </div>
  )
}