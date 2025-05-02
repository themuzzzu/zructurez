
import { useState, useCallback } from 'react';

export const usePostLike = (postId: string, initialLikeStatus: boolean = false) => {
  const [currentLikeStatus, setCurrentLikeStatus] = useState<boolean>(initialLikeStatus);

  const toggleLike = useCallback(async () => {
    try {
      // In a real application, you would make an API call here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentLikeStatus(prevStatus => !prevStatus);
      console.log(`Post ${postId} like status toggled to: ${!currentLikeStatus}`);
    } catch (error) {
      console.error('Error toggling post like:', error);
    }
  }, [postId, currentLikeStatus]);

  return { currentLikeStatus, toggleLike };
};
