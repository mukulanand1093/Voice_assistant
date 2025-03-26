"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { MessageType } from "./ChatUI"

interface MessageBubbleProps {
  message: MessageType
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { sender, content, timestamp, type, isLoading, mediaUrl } = message

  useEffect(() => {
    // Reset playing state when media URL changes
    setIsPlaying(false)
  }, [mediaUrl])

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-4 duration-300",
        sender === "user" ? "ml-auto items-end" : "mr-auto items-start",
      )}
    >
      <div className="flex items-end gap-2">
        {sender === "ai" && (
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">AI</span>
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2 break-words shadow-sm",
            sender === "user"
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none",
          )}
        >
          {isLoading ? (
            <div className="flex space-x-2 py-2 px-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce animation-delay-400"></div>
            </div>
          ) : type === "text" ? (
            <p>{content}</p>
          ) : type === "image" && mediaUrl ? (
            <div className="overflow-hidden rounded-lg">
              <img
                src={mediaUrl || "/placeholder.svg"}
                alt="User shared image"
                className="max-w-full h-auto max-h-60 object-contain"
              />
              {content && <p className="mt-2">{content}</p>}
            </div>
          ) : type === "audio" && mediaUrl ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white dark:bg-gray-600"
                onClick={toggleAudioPlayback}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Play className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                )}
              </Button>
              <div className="flex-1">
                <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-500 w-${isPlaying ? "animate-progress" : "0"}`}></div>
                </div>
                {content && <p className="mt-2">{content}</p>}
              </div>
              
              {/* Hidden audio element to control playback */}
              <audio 
                ref={audioRef} 
                src={mediaUrl} 
                onEnded={handleAudioEnded}
              />
            </div>
          ) : null}
        </div>

        {sender === "user" && (
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-700 dark:text-gray-300 text-xs font-semibold">You</span>
          </div>
        )}
      </div>

      <span className={cn("text-xs mt-1 text-gray-500 dark:text-gray-400", sender === "user" ? "mr-10" : "ml-10")}>
        {format(timestamp, "h:mm a")}
      </span>
    </div>
  )
}