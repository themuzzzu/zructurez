
import { useState } from "react";
import { Folder, Plus, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Folder {
  id: string;
  name: string;
  icon: React.ReactNode;
  isPremium: boolean;
}

interface FoldersSectionProps {
  onSelectFolder: (folder: string) => void;
  isPremiumUser: boolean;
}

export const FoldersSection = ({
  onSelectFolder,
  isPremiumUser,
}: FoldersSectionProps) => {
  const [folders, setFolders] = useState<Folder[]>([
    { id: "all", name: "All Messages", icon: <Folder className="h-4 w-4" />, isPremium: false },
    { id: "work", name: "Work", icon: <Folder className="h-4 w-4" />, isPremium: true },
    { id: "personal", name: "Personal", icon: <Folder className="h-4 w-4" />, isPremium: true },
  ]);
  
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [showAddFolderDialog, setShowAddFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  const handleFolderClick = (folderId: string, isPremium: boolean) => {
    if (isPremium && !isPremiumUser) {
      toast.error("This feature is available for premium users only");
      return;
    }
    
    setSelectedFolder(folderId);
    onSelectFolder(folderId);
  };
  
  const handleAddFolder = () => {
    if (!isPremiumUser) {
      toast.error("Creating folders is a premium feature");
      setShowAddFolderDialog(false);
      return;
    }
    
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      icon: <Folder className="h-4 w-4" />,
      isPremium: true
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setShowAddFolderDialog(false);
    toast.success(`Folder "${newFolderName}" created`);
  };
  
  return (
    <div className="border-b pb-2">
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <h3 className="text-sm font-medium">Folders</h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowAddFolderDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Manage Folders</DropdownMenuItem>
              <DropdownMenuItem disabled={isPremiumUser}>
                Upgrade to Premium
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-1 px-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
              selectedFolder === folder.id
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            } ${folder.isPremium && !isPremiumUser ? "opacity-60" : ""}`}
            onClick={() => handleFolderClick(folder.id, folder.isPremium)}
          >
            {folder.icon}
            <span>{folder.name}</span>
            {folder.isPremium && !isPremiumUser && (
              <span className="ml-auto text-xs text-primary">Premium</span>
            )}
          </button>
        ))}
      </div>
      
      <Dialog open={showAddFolderDialog} onOpenChange={setShowAddFolderDialog}>
        <DialogContent className="sm:max-w-md dark:bg-[#111111] dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            {!isPremiumUser && (
              <p className="text-xs text-muted-foreground mt-2">
                Creating folders is a premium feature. Upgrade to access.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
