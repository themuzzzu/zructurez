
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UserPost } from '@/types/business';

interface PostCardProps {
  post: UserPost;
  onRefresh?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onRefresh }) => {
  const handleLike = () => {
    // Like functionality
    console.log('Like post:', post.id);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleComment = () => {
    // Comment functionality
    console.log('Comment on post:', post.id);
  };

  const handleRepost = () => {
    // Repost functionality
    console.log('Repost:', post.id);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleShare = () => {
    // Share functionality
    console.log('Share post:', post.id);
  };

  // Default values for profile if not available
  const username = post.profile?.username || 'Anonymous';
  const fullName = post.profile?.full_name || 'User';
  const avatarUrl = post.profile?.avatar_url;
  // Get initials for avatar fallback
  const initials = fullName.split(' ').map(name => name[0]).join('').toUpperCase();

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-semibold">{fullName}</h3>
            <span className="ml-2 text-sm text-muted-foreground">@{username}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1">{post.content}</p>
          
          {post.image_url && (
            <div className="mt-3">
              <img 
                src={post.image_url} 
                alt="Post" 
                className="rounded-md max-h-80 object-cover w-full" 
              />
            </div>
          )}
          
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" size="sm" onClick={handleComment} className="text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments_count || 0}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleRepost} className="text-muted-foreground">
              <Repeat className="h-4 w-4 mr-1" />
              {post.reposts_count || 0}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleLike} className="text-muted-foreground">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes_count || 0}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
