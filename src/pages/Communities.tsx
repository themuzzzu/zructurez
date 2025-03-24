
import { useState } from "react";
import { GroupsSidebar } from "@/components/communities/GroupsSidebar";
import { PostCreator } from "@/components/communities/PostCreator";
import { PostsList } from "@/components/communities/PostsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { JoinGroupDialog } from "@/components/communities/JoinGroupDialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Communities = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showJoinGroupDialog, setShowJoinGroupDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger a refresh of posts
  };

  const handleCreateGroupClick = () => {
    if (!user) {
      toast.error("Please sign in to create a community");
      navigate("/auth");
      return;
    }
    setShowCreateGroupDialog(true);
  };

  const handleJoinGroupClick = () => {
    if (!user) {
      toast.error("Please sign in to join communities");
      navigate("/auth");
      return;
    }
    setShowJoinGroupDialog(true);
  };

  return (
    <div className="container max-w-[1400px] pt-20 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Communities</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreateGroupClick} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Community
          </Button>
          <Button onClick={handleJoinGroupClick}>
            Join Communities
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar with groups */}
        <div className="md:col-span-1">
          <GroupsSidebar 
            selectedGroup={selectedGroup} 
            setSelectedGroup={setSelectedGroup} 
          />
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <PostCreator 
            selectedGroup={selectedGroup} 
            onPostCreated={handlePostCreated} 
          />
          <PostsList 
            selectedGroup={selectedGroup} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
      </div>

      <CreateGroupDialog 
        open={showCreateGroupDialog} 
        onClose={() => setShowCreateGroupDialog(false)} 
      />
      
      <JoinGroupDialog
        open={showJoinGroupDialog}
        onClose={() => setShowJoinGroupDialog(false)}
      />
    </div>
  );
};

export default Communities;
