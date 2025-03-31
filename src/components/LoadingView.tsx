
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Inspiring quotes for loading screens
const loadingQuotes = [
  "Quality takes time, just like a good cup of coffee",
  "The best things in life are worth waiting for",
  "Preparing your experience with care...",
  "This loading time is sponsored by patience",
  "Taking a moment to gather the best for you",
  "Excellence is worth the wait",
  "Finding the perfect items just for you",
  "Curating quality takes a moment",
  "Your amazing content is on its way",
  "Thanks for your patience, quality incoming!",
  "Good things come to those who wait",
  "The calm before the awesome",
  "Making everything perfect for you...",
  "Counting stars while you wait...",
  "Loading awesomeness...",
  "Brewing your experience to perfection"
];

export const LoadingView = () => {
  const [quote, setQuote] = useState("");
  
  useEffect(() => {
    // Select a random quote
    setQuote(loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]);
    
    // Change quote every 5 seconds
    const interval = setInterval(() => {
      setQuote(loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm max-w-xs text-center animate-fade-in">
            {quote}
          </p>
        </div>
      </div>
    </div>
  );
};
