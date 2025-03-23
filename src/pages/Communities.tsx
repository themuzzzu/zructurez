
import { useState } from "react";
import { GroupsSidebar } from "@/components/communities/GroupsSidebar";
import { PostCreator } from "@/components/communities/PostCreator";
import { PostsList } from "@/components/communities/PostsList";

const Communities = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger a refresh of posts
  };

  return (
    <div className="container max-w-[1400px] pt-20 pb-16">
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
    </div>
  );
};

export default Communities;
