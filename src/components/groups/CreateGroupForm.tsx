import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface CreateGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGroupForm = ({ isOpen, onClose, onSuccess }: CreateGroupFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('groups')
        .insert({
          name,
          description: description.trim() || null,
          image_url: imageUrl,
          user_id: user.id
        });

      if (error) throw error;

      toast.success("Group created successfully!");
      onSuccess();
      onClose();
      setName("");
      setDescription("");
      setImageUrl(null);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Failed to create group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your group"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Group Image</Label>
            <ImageUpload
              selectedImage={imageUrl}
              onImageSelect={setImageUrl}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Group'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};