
import { useEffect, useState } from "react";
import { getScheduledPosts, cancelScheduledPost } from "@/services/postService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduledPost {
  id: string;
  content: string;
  image_url: string | null;
  category: string | null;
  location: string | null;
  scheduled_for: string;
  status: string;
  groups?: {
    name: string;
    image_url: string | null;
  };
}

export const ScheduledPosts = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const data = await getScheduledPosts();
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      toast.error("Failed to load scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (postId: string) => {
    try {
      setDeleting(postId);
      await cancelScheduledPost(postId);
      toast.success("Scheduled post cancelled");
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error cancelling scheduled post:", error);
      toast.error("Failed to cancel scheduled post");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="h-24 animate-pulse rounded-md bg-zinc-800"></div>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6 text-center">
          <CalendarClock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">No scheduled posts</p>
          <p className="text-muted-foreground">Your scheduled posts will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => setDialogOpen(true)}
      >
        <CalendarClock className="h-4 w-4 mr-2" />
        View Scheduled Posts ({posts.length})
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Scheduled Posts</DialogTitle>
            <DialogDescription>
              Here are your posts scheduled for future publication.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-full mt-4 pb-6 pr-4">
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex justify-between items-center">
                      <span>
                        {post.groups ? `In ${post.groups.name}` : "Timeline post"}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {format(new Date(post.scheduled_for), "PPP 'at' p")}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-3">{post.content}</p>
                    
                    {post.image_url && (
                      <div className="mt-2 rounded-md overflow-hidden h-20 w-full">
                        <img 
                          src={post.image_url}
                          alt="Post attachment"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0 justify-end">
                    <Button 
                      variant="destructive"
                      size="sm"
                      disabled={deleting === post.id}
                      onClick={() => handleCancel(post.id)}
                    >
                      {deleting === post.id ? (
                        "Cancelling..."
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
