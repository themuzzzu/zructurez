import { Group } from "@/types/group";
import { Users2, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { SearchInput } from "@/components/SearchInput";

interface GroupListProps {
  groups: Group[];
  selectedGroup: Group | null;
  onSelectGroup: (group: Group) => void;
  onAddMembers: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const GroupList = ({ 
  groups, 
  selectedGroup, 
  onSelectGroup, 
  onAddMembers,
  searchQuery,
  onSearchChange
}: GroupListProps) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search groups..."
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowCreateGroup(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onAddMembers}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
              selectedGroup?.id === group.id ? 'bg-accent' : ''
            }`}
            onClick={() => onSelectGroup(group)}
          >
            <div className="flex items-center gap-3">
              {group.image_url ? (
                <img
                  src={group.image_url}
                  alt={group.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{group.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {group.description || 'No description'}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Users2 className="h-3 w-3 mr-1" />
                  {group.group_members?.count || 0} members
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No groups found
          </div>
        )}
      </div>

      <CreateGroupDialog 
        open={showCreateGroup} 
        onClose={() => setShowCreateGroup(false)} 
      />
    </div>
  );
};