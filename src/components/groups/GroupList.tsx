import { Group } from "@/types/group";
import { Users2 } from "lucide-react";

interface GroupListProps {
  groups: Group[];
  selectedGroup: Group | null;
  onSelectGroup: (group: Group) => void;
}

export const GroupList = ({ groups, selectedGroup, onSelectGroup }: GroupListProps) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-8rem)]">
      {groups?.map((group) => (
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
                {group.group_members.count} members
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};