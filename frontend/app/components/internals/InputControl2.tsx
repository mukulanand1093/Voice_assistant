"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, ImageIcon, Send, X } from "lucide-react";

interface InputControlsProps {
  onSendMessage: (
    content: string, 
    type: "text" | "image" | "audio", 
    userMediaUrl?: string, 
    aiMediaUrl?: string
  ) => void;
}

export function InputControls2({ onSendMessage }: InputControlsProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; file: File | null } | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<{ 
    userAudioUrl: string | null, 
    aiResponseAudioUrl: string | null 
  }>({ userAudioUrl: null, aiResponseAudioUrl: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSendTextMessage = () => {
    if (inputValue.trim() === "") return;
    onSendMessage(inputValue, "text");
    setInputValue("");
  };

  const handleSendImageMessage = () => {
    if (!selectedImage) return;
    onSendMessage(inputValue, "image", selectedImage.url);
    setInputValue("");
    setSelectedImage(null);
  };

  const handleSendAudioMessage = () => {
    if (!recordedAudio.userAudioUrl || !recordedAudio.aiResponseAudioUrl) return;
    
    onSendMessage(
      inputValue, 
      "audio", 
      recordedAudio.userAudioUrl, 
      recordedAudio.aiResponseAudioUrl
    );
    
    setInputValue("");
    setRecordedAudio({ userAudioUrl: null, aiResponseAudioUrl: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedImage) {
        handleSendImageMessage();
      } else if (recordedAudio.userAudioUrl && recordedAudio.aiResponseAudioUrl) {
        handleSendAudioMessage();
      } else {
        handleSendTextMessage();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage({ url, file });
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      // Stop recording and release the stream
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    } else {
      // Start recording
      setIsRecording(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        let audioChunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioFile = new File([audioBlob], "recorded_audio.wav", { type: "audio/wav" });
          const userAudioUrl = URL.createObjectURL(audioFile);

          // Prepare for upload
          const formData = new FormData();
          formData.append("file", audioFile);

          try {
            const response = await fetch("http://localhost:8000/upload-audio/", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            // Create a blob URL for the response audio
            const responseBlob = await response.blob();
            const aiResponseAudioUrl = URL.createObjectURL(responseBlob);

            // Update state with both user and AI audio URLs
            setRecordedAudio({ 
              userAudioUrl, 
              aiResponseAudioUrl 
            });

            setIsRecording(false);
          } catch (error) {
            console.error("Error uploading audio:", error);
            setIsRecording(false);
          }
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setTimeout(() => recorder.stop(), 30000); // Stop recording after 30 sec max
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setIsRecording(false);
      }
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearRecordedAudio = () => {
    // Revoke object URLs to free up memory
    if (recordedAudio.userAudioUrl) URL.revokeObjectURL(recordedAudio.userAudioUrl);
    if (recordedAudio.aiResponseAudioUrl) URL.revokeObjectURL(recordedAudio.aiResponseAudioUrl);
    
    setRecordedAudio({ userAudioUrl: null, aiResponseAudioUrl: null });
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Image preview */}
      {selectedImage && (
        <div className="mb-3 relative">
          <div className="rounded-lg overflow-hidden relative max-w-xs">
            <img src={selectedImage.url || "/placeholder.svg"} alt="Selected" className="max-h-40 object-contain" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={clearSelectedImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Audio preview */}
      {recordedAudio.userAudioUrl && recordedAudio.aiResponseAudioUrl && (
        <div className="mb-3 space-y-2">
          <div className="rounded-lg overflow-hidden relative max-w-xs">
            <p className="text-xs text-gray-500 mb-1">Your Recording</p>
            <audio src={recordedAudio.userAudioUrl} controls className="w-full" />
          </div>
          <div className="rounded-lg overflow-hidden relative max-w-xs">
            <p className="text-xs text-gray-500 mb-1">AI Response</p>
            <audio src={recordedAudio.aiResponseAudioUrl} controls className="w-full" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={clearRecordedAudio}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

        <Button variant="outline" size="icon" className="rounded-full" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Button>

        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          className={`rounded-full ${isRecording ? "animate-pulse" : ""}`}
          onClick={handleRecordToggle}
        >
          <Mic className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording 
                ? "Recording..." 
                : recordedAudio.userAudioUrl && recordedAudio.aiResponseAudioUrl
                  ? "Add a description (optional)" 
                  : "Type a message..."
            }
            disabled={isRecording}
            className="pr-10 py-6 rounded-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus-visible:ring-indigo-500"
          />

          <Button
            onClick={
              selectedImage 
                ? handleSendImageMessage 
                : recordedAudio.userAudioUrl && recordedAudio.aiResponseAudioUrl
                  ? handleSendAudioMessage 
                  : handleSendTextMessage
            }
            disabled={
              (inputValue.trim() === "" && !selectedImage && !recordedAudio.userAudioUrl) || 
              isRecording
            }
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}