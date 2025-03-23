
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload/ImageUpload";
import type { Profile } from "@/types/profile";

interface ProfileEditFormProps {
  profile: Profile;
  loading: boolean;
  onSave: (updates: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
  onAvatarChange: (file: File) => Promise<void>;
}

export function ProfileEditForm({ 
  profile, 
  loading, 
  onSave, 
  onCancel,
  onAvatarChange 
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    bio: profile.bio || "",
    location: profile.location || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      await onAvatarChange(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <ImageUpload
          selectedImage={profile.avatar_url || null}
          onImageSelect={() => {}}
          skipAutoSave={true}
        />
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          accept="image/*"
          className="hidden"
          id="avatar-upload"
        />
        <Label
          htmlFor="avatar-upload"
          className="mt-4 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Upload New Photo
        </Label>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username"
          />
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Where are you based?"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
