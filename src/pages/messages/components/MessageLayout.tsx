
import React from "react";

interface MessageLayoutProps {
  children: React.ReactNode;
}

export const MessageLayout = ({ children }: MessageLayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row md:grid md:grid-cols-12 gap-0 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden scrollbar-hide">
      {children}
    </div>
  );
};
