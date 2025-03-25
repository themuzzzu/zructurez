
import { useState, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceSearchRecorderProps {
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
}

export function VoiceSearchRecorder({
  onStart,
  onStop,
  onCancel,
}: VoiceSearchRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle recording timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const handleStart = () => {
    setIsRecording(true);
    setRecordingTime(0);
    onStart();
  };
  
  // Stop recording
  const handleStop = () => {
    setIsRecording(false);
    setIsProcessing(true);
    onStop();
    
    // Simulate processing (replace with actual processing state)
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };
  
  // Cancel recording
  const handleCancel = () => {
    setIsRecording(false);
    setRecordingTime(0);
    onCancel();
  };
  
  return (
    <div className="p-4 flex flex-col items-center">
      <h3 className="font-medium text-lg mb-2">Voice Search</h3>
      
      {isProcessing ? (
        <div className="py-6 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
          <p className="text-muted-foreground">Processing your voice...</p>
        </div>
      ) : (
        <>
          <div className="py-6 flex flex-col items-center">
            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              isRecording 
                ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' 
                : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {isRecording ? (
                <Square className="h-10 w-10 text-red-500" />
              ) : (
                <Mic className="h-10 w-10 text-primary" />
              )}
            </div>
            
            {isRecording ? (
              <div className="text-center">
                <p className="font-medium text-xl text-red-500">{formatTime(recordingTime)}</p>
                <p className="text-sm text-muted-foreground mt-1">Recording... speak now</p>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Tap the microphone to start speaking
              </p>
            )}
          </div>
          
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            
            {isRecording ? (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleStop}
              >
                Stop
              </Button>
            ) : (
              <Button
                variant="default"
                className="flex-1"
                onClick={handleStart}
              >
                Start
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
