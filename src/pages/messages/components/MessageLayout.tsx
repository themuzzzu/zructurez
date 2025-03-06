
import React from "react";

interface MessageLayoutProps {
  children: React.ReactNode;
}

export const MessageLayout = ({ children }: MessageLayoutProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-160px)]">
      {children}
    </div>
  );
};
