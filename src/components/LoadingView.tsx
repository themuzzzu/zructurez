
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

// Inspiring quotes and wisdom for loading screens
const loadingContent = [
  {
    type: "proverb",
    content: "The journey of a thousand miles begins with a single step.",
    origin: "Chinese Proverb"
  },
  {
    type: "quote",
    content: "Quality takes time, just like a good cup of coffee.",
    author: "Unknown"
  },
  {
    type: "principle",
    content: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    type: "fact",
    content: "The human brain processes images 60,000 times faster than text."
  },
  {
    type: "proverb",
    content: "Don't put off until tomorrow what you can do today.",
    origin: "Benjamin Franklin"
  },
  {
    type: "quote",
    content: "The best things in life are worth waiting for.",
    author: "Unknown"
  },
  {
    type: "principle",
    content: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  },
  {
    type: "fact",
    content: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old."
  },
  {
    type: "quote",
    content: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
    author: "Joyce Meyer"
  },
  {
    type: "proverb",
    content: "A watched pot never boils.",
    origin: "English Proverb"
  },
  {
    type: "fact",
    content: "A day on Venus is longer than a year on Venus. Venus rotates so slowly that it takes 243 Earth days to complete one rotation."
  },
  {
    type: "principle",
    content: "Focus on progress, not perfection.",
    author: "Unknown"
  },
  {
    type: "quote",
    content: "This loading time is sponsored by patience.",
    author: "Unknown"
  },
  {
    type: "proverb",
    content: "Good things come to those who wait.",
    origin: "English Proverb"
  },
  {
    type: "fact",
    content: "The average person will spend six months of their life waiting at traffic lights."
  }
];

export const LoadingView = ({ section = "general" }) => {
  const [content, setContent] = useState(loadingContent[0]);
  const [fadeIn, setFadeIn] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Select a random content item
    setContent(loadingContent[Math.floor(Math.random() * loadingContent.length)]);
    
    // Change content every 5 seconds with fade effect
    const contentInterval = setInterval(() => {
      setFadeIn(false);
      
      setTimeout(() => {
        setContent(loadingContent[Math.floor(Math.random() * loadingContent.length)]);
        setFadeIn(true);
      }, 500);
    }, 5000);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Slow down as it approaches 100%
        const increment = prev < 70 ? 15 : prev < 90 ? 5 : 1;
        const newProgress = Math.min(prev + increment, 99);
        return newProgress;
      });
    }, 300);
    
    return () => {
      clearInterval(contentInterval);
      clearInterval(progressInterval);
    };
  }, []);
  
  // Different loading styles for different sections
  const getLoadingStyle = () => {
    switch(section) {
      case "marketplace":
        return {
          indicatorClass: "bg-blue-500",
          icon: <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        };
      case "business":
        return {
          indicatorClass: "bg-emerald-500",
          icon: <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        };
      case "profile":
        return {
          indicatorClass: "bg-purple-500",
          icon: <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        };
      default:
        return {
          indicatorClass: "bg-primary",
          icon: <Loader2 className="h-8 w-8 animate-spin text-primary" />
        };
    }
  };
  
  const style = getLoadingStyle();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          {style.icon}
          
          <div className={`text-center transition-opacity duration-500 max-w-md mx-auto px-4 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-muted-foreground text-sm md:text-base">
              {content.content}
            </p>
            
            {(content.author || content.origin) && (
              <p className="text-xs text-muted-foreground mt-1">
                — {content.author || content.origin}
              </p>
            )}
            
            {content.type === "fact" && (
              <div className="mt-1 text-xs text-muted-foreground/70">Fun Fact</div>
            )}
          </div>
          
          <div className="w-full max-w-xs mt-4">
            <Progress 
              value={progress} 
              className="h-1" 
              indicatorClassName={style.indicatorClass}
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Loading {section}... {progress}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
