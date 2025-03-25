
import { useState, useCallback } from "react";
import { saveVoiceRecording, processVoiceToText } from "@/services/searchService";

interface UseVoiceSearchProps {
  onTranscription?: (text: string) => void;
}

export const useVoiceSearch = ({ onTranscription }: UseVoiceSearchProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioChunks([]);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Set up event handlers
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };
      
      // Start recording
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting voice recording:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  }, []);
  
  // Stop recording and process audio
  const stopRecording = useCallback(async () => {
    if (!mediaRecorder) {
      setError("No recording in progress");
      return;
    }
    
    setIsRecording(false);
    
    // Stop the recorder
    mediaRecorder.stop();
    
    // Stop all audio tracks
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    
    // Process after a short delay to ensure all data is captured
    setTimeout(async () => {
      if (audioChunks.length === 0) {
        setError("No audio recorded");
        return;
      }
      
      try {
        setIsProcessing(true);
        
        // Create audio blob from chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Save recording to server
        const recording = await saveVoiceRecording(audioBlob);
        
        if (!recording) {
          throw new Error("Failed to save recording");
        }
        
        // Process the audio to text
        const transcription = await processVoiceToText(recording.id);
        
        if (transcription && onTranscription) {
          onTranscription(transcription);
        }
      } catch (err) {
        console.error("Error processing voice recording:", err);
        setError("Failed to process voice recording");
      } finally {
        setIsProcessing(false);
        setAudioChunks([]);
      }
    }, 300);
  }, [mediaRecorder, audioChunks, onTranscription]);
  
  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setAudioChunks([]);
  }, [mediaRecorder]);
  
  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
