
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/image-upload/ImageUpload";
import { PollDialog } from "@/components/chat/PollDialog";
import { toast } from "sonner";
import { Image, ListChecks, Film, Send, Info } from "lucide-react";

interface Post {
  id: string;
  user_id: string;
  group_id: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  poll_id?: string | null;
  gif_url?: string | null;
  profile?: {
    username: string;
    avatar_url: string;
  };
  group?: {
    name: string;
  };
  poll?: {
    question: string;
    options: PollOption[];
    votes: PollVote[];
  };
}

interface PollOption {
  id: string;
  poll_id: string;
  text: string;
}

interface PollVote {
  id: string;
  poll_option_id: string;
  user_id: string;
}

interface CreatePostData {
  content: string;
  group_id: string;
  image_url?: string | null;
  poll_id?: string | null;
  gif_url?: string | null;
}

const Communities = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);

  const TENOR_API_KEY = "LIVDSRZULELA"; // Use env variable in production
  const TENOR_CLIENT_KEY = "marketplace_app";

  useEffect(() => {
    fetchGroups();
    fetchPosts();
  }, [selectedGroup]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members (
          count,
          members:user_id
        )
      `);

    if (error) {
      console.error('Error fetching groups:', error);
      return;
    }

    const mappedGroups: Group[] = data.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      image_url: group.image_url,
      created_at: group.created_at,
      user_id: group.user_id,
      group_members: {
        count: group.group_members?.length || 0,
        members: group.group_members?.map((m: any) => m.members) || []
      },
      type: "group",
      avatar: group.image_url || '/placeholder.svg',
      time: group.created_at,
      lastMessage: null,
      unread: 0,
      participants: [],
      messages: [],
      unreadCount: 0,
      isGroup: true,
      userId: group.user_id
    }));

    setGroups(mappedGroups);
  };

  const fetchPosts = async () => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:profile_id (username, avatar_url),
        group:group_id (name),
        poll:poll_id (
          id,
          question,
          poll_options (id, text),
          poll_votes (id, poll_option_id, user_id)
        )
      `)
      .order('created_at', { ascending: false });

    if (selectedGroup) {
      query = query.eq('group_id', selectedGroup);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
  };

  const createPost = async () => {
    if (!postContent.trim() && !selectedImage && !selectedGif) {
      toast.error("Please add some content to your post");
      return;
    }

    if (!selectedGroup) {
      toast.error("Please select a group to post to");
      return;
    }

    setIsPosting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to post");
        return;
      }

      const postData: CreatePostData = {
        content: postContent,
        group_id: selectedGroup,
      };

      if (selectedImage) {
        postData.image_url = selectedImage;
      }

      if (selectedGif) {
        postData.gif_url = selectedGif;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select();

      if (error) {
        throw error;
      }

      setPostContent("");
      setSelectedImage(null);
      setSelectedGif(null);
      fetchPosts();
      toast.success("Post created successfully");
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCreatePoll = async (question: string, options: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a poll");
        return;
      }

      // Insert poll
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          question,
          user_id: user.id
        })
        .select();

      if (pollError || !pollData?.[0]) {
        throw pollError;
      }

      const pollId = pollData[0].id;

      // Insert poll options
      const optionsToInsert = options.map(option => ({
        poll_id: pollId,
        text: option
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);

      if (optionsError) {
        throw optionsError;
      }

      // Create a post with the poll
      if (selectedGroup) {
        const { error: postError } = await supabase
          .from('posts')
          .insert({
            content: question,
            group_id: selectedGroup,
            poll_id: pollId,
            user_id: user.id
          });

        if (postError) {
          throw postError;
        }
      }

      fetchPosts();
      setIsPollDialogOpen(false);
      toast.success("Poll created successfully");
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error("Failed to create poll");
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to vote");
        return;
      }

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('poll_votes')
          .update({ poll_option_id: optionId })
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('poll_votes')
          .insert({
            poll_id: pollId,
            poll_option_id: optionId,
            user_id: user.id
          });

        if (error) throw error;
      }

      fetchPosts();
      toast.success("Vote recorded");
    } catch (error) {
      console.error('Error voting in poll:', error);
      toast.error("Failed to record vote");
    }
  };

  const searchGifs = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://api.tenor.com/v1/search?q=${encodeURIComponent(searchTerm)}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=12`
      );
      
      const data = await response.json();
      setGifs(data.results || []);
    } catch (error) {
      console.error('Error searching GIFs:', error);
      toast.error("Failed to load GIFs");
    }
  };

  const handleGifClick = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
  };

  const getUserVote = (post: Post, userId: string) => {
    if (!post.poll?.votes) return null;
    return post.poll.votes.find(vote => vote.user_id === userId)?.poll_option_id;
  };

  const getVoteCount = (post: Post, optionId: string) => {
    if (!post.poll?.votes) return 0;
    return post.poll.votes.filter(vote => vote.poll_option_id === optionId).length;
  };

  const getTotalVotes = (post: Post) => {
    if (!post.poll?.votes) return 0;
    return post.poll.votes.length;
  };

  return (
    <div className="container max-w-[1400px] pt-20 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar with groups */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <h1 className="text-2xl font-bold mb-4">Communities</h1>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedGroup(null)}
              >
                All Communities
              </Button>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-2 pr-4">
                  {groups.map((group) => (
                    <Button
                      key={group.id}
                      variant={selectedGroup === group.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={group.avatar} alt={group.name} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{group.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {group.group_members.count}
                      </span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <Card className="p-4 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share something with the community..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {selectedImage && (
                <div className="relative mt-2">
                  <img 
                    src={selectedImage} 
                    alt="Selected image" 
                    className="max-h-60 rounded-md object-contain"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {selectedGif && (
                <div className="relative mt-2">
                  <img 
                    src={selectedGif} 
                    alt="Selected GIF" 
                    className="max-h-60 rounded-md object-contain"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedGif(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {!selectedImage && (
                <div className="mt-2">
                  <ImageUpload
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                    skipAutoSave={true}
                  />
                </div>
              )}

              {showGifPicker && (
                <div className="mt-2 p-2 border rounded-md">
                  <div className="mb-2">
                    <Input
                      placeholder="Search GIFs..."
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          searchGifs(gifSearch);
                        }
                      }}
                    />
                    <Button 
                      className="mt-2" 
                      variant="outline"
                      onClick={() => searchGifs(gifSearch)}
                    >
                      Search
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2 max-h-[300px] overflow-y-auto">
                    {gifs.length === 0 ? (
                      <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">
                        Search for GIFs to see results
                      </div>
                    ) : (
                      gifs.map((gif, index) => (
                        <div 
                          key={index} 
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleGifClick(gif.media[0].gif.url)}
                        >
                          <img 
                            src={gif.media[0].gif.preview} 
                            alt={gif.content_description} 
                            className="w-full h-24 object-cover rounded-md"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                  disabled={!!selectedImage}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    if (!showGifPicker) {
                      setGifs([]);
                      setGifSearch("");
                    }
                  }}
                >
                  <Film className="h-4 w-4 mr-2" />
                  GIF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPollDialogOpen(true)}
                >
                  <ListChecks className="h-4 w-4 mr-2" />
                  Poll
                </Button>
                <Button 
                  className="ml-auto"
                  onClick={createPost}
                  disabled={isPosting || (!postContent.trim() && !selectedImage && !selectedGif)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={post.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`} 
                        alt={post.profile?.username || "User"} 
                      />
                      <AvatarFallback>{post.profile?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{post.profile?.username || "Anonymous"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleString()} 
                            {post.group && ` • in ${post.group.name}`}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2">{post.content}</p>
                      
                      {post.image_url && (
                        <div className="mt-4">
                          <img 
                            src={post.image_url} 
                            alt="Post image" 
                            className="max-h-96 object-contain rounded-md"
                          />
                        </div>
                      )}
                      
                      {post.gif_url && (
                        <div className="mt-4">
                          <img 
                            src={post.gif_url} 
                            alt="GIF" 
                            className="max-h-96 object-contain rounded-md"
                          />
                        </div>
                      )}
                      
                      {post.poll && post.poll.id && (
                        <div className="mt-4 border rounded-md p-4">
                          <p className="font-medium mb-2">{post.poll.question}</p>
                          <div className="space-y-2">
                            {post.poll.options?.map((option: PollOption) => {
                              const voteCount = getVoteCount(post, option.id);
                              const totalVotes = getTotalVotes(post);
                              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                              
                              return (
                                <div key={option.id} className="relative">
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between hover:bg-muted"
                                    onClick={() => handleVote(post.poll!.id, option.id)}
                                  >
                                    <span>{option.text}</span>
                                    <span>{voteCount} votes ({percentage}%)</span>
                                  </Button>
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-primary/10 rounded-l-sm"
                                    style={{ width: `${percentage}%`, zIndex: -1 }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {getTotalVotes(post)} votes total
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to post in this community!
                </p>
                {!selectedGroup && (
                  <p className="text-sm text-muted-foreground">
                    Select a community to post in
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Poll creation dialog */}
      <PollDialog
        open={isPollDialogOpen}
        onOpenChange={setIsPollDialogOpen}
        onCreatePoll={handleCreatePoll}
      />
    </div>
  );
};

export default Communities;
