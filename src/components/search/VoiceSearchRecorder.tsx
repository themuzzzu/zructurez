
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface VoiceSearchRecorderProps {
  onClose: () => void;
  onTranscriptionComplete: (transcript: string) => void;
}

export function VoiceSearchRecorder({ onClose, onTranscriptionComplete }: VoiceSearchRecorderProps) {
  const { data: currentUser } = useCurrentUser();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Request microphone access and set up recorder
  const setupRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        processAudio();
      };
      
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Could not access your microphone");
      onClose();
    }
  };
  
  // Start recording
  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingSeconds(0);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };
  
  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
    
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Process recorded audio
  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) {
      toast.error("No audio recorded");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      if (!currentUser) {
        // For users who aren't logged in, just return a demo response
        setTimeout(() => {
          const mockTranscript = "show me winter jackets";
          onTranscriptionComplete(mockTranscript);
        }, 1500);
        return;
      }
      
      // Upload to Supabase Storage
      const fileName = `${Date.now()}.webm`;
      const filePath = `voice-search/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(filePath, audioBlob);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(filePath);
      
      // Send to transcription edge function
      const { data: transcriptionResult, error: transcriptionError } = await supabase.functions
        .invoke('process-voice-search', {
          body: { audioUrl: publicUrl },
        });
        
      if (transcriptionError) throw transcriptionError;
      
      // Insert directly into the voice_recordings table
      if (currentUser?.id) {
        const { error: insertError } = await supabase
          .from('voice_recordings')
          .insert({
            user_id: currentUser.id,
            audio_url: publicUrl,
            transcription: transcriptionResult.transcription
          });
          
        if (insertError) {
          console.error('Error saving voice recording:', insertError);
        }
      }
      
      onTranscriptionComplete(transcriptionResult.transcription);
    } catch (error) {
      console.error('Error processing voice recording:', error);
      toast.error("Failed to process your voice search");
      setIsProcessing(false);
      onClose();
    }
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Set up recorder on mount
  useEffect(() => {
    setupRecorder();
    
    return () => {
      // Clean up
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search with your voice</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-center">Processing your voice search...</p>
            </div>
          ) : (
            <>
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                isRecording 
                  ? 'bg-red-100 dark:bg-red-900 animate-pulse' 
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <Mic className={`h-8 w-8 ${
                  isRecording ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                }`} />
              </div>
              
              <p className="text-lg font-medium mb-2">
                {isRecording ? 'Listening...' : 'Ready to listen'}
              </p>
              
              {isRecording && (
                <p className="text-sm text-muted-foreground mb-4">
                  {formatTime(recordingSeconds)}
                </p>
              )}
              
              <p className="text-sm text-muted-foreground text-center mb-4">
                {isRecording 
                  ? 'Speak clearly, then click stop when you\'re done'
                  : 'Click record and say what you\'re looking for'}
              </p>
              
              {isRecording ? (
                <Button 
                  variant="destructive"
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={stopRecording}
                >
                  <Square className="h-4 w-4" />
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  variant="default"
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={startRecording}
                >
                  <Mic className="h-4 w-4" />
                  Start Recording
                </Button>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
