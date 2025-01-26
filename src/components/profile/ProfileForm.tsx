import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LocationSelector } from "../LocationSelector";

interface ProfileFormProps {
  profile: {
    name: string;
    username: string;
    bio: string;
    location: string;
  };
  isEditing: boolean;
  loading: boolean;
  disappearingMessages: boolean;
  onProfileChange: (field: string, value: string) => void;
  onDisappearingMessagesChange: (enabled: boolean) => void;
  onSave: () => void;
}

export const ProfileForm = ({
  profile,
  isEditing,
  loading,
  disappearingMessages,
  onProfileChange,
  onDisappearingMessagesChange,
  onSave,
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={profile.name || ""}
          onChange={(e) => onProfileChange("name", e.target.value)}
          disabled={!isEditing}
          placeholder="Enter your name"
        />
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile.username || ""}
          onChange={(e) => onProfileChange("username", e.target.value)}
          disabled={!isEditing}
          placeholder="Enter username"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio || ""}
          onChange={(e) => onProfileChange("bio", e.target.value)}
          disabled={!isEditing}
          placeholder="Tell us about yourself"
          className="h-32"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        {isEditing ? (
          <LocationSelector
            value={profile.location || ""}
            onChange={(value) => onProfileChange("location", value)}
          />
        ) : (
          <Input
            id="location"
            value={profile.location || ""}
            disabled
            placeholder="No location set"
          />
        )}
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="disappearing-messages" className="text-sm font-medium">
          Disappearing messages
        </Label>
        <Switch
          id="disappearing-messages"
          checked={disappearingMessages}
          onCheckedChange={onDisappearingMessagesChange}
        />
      </div>
      {disappearingMessages && (
        <p className="text-sm text-muted-foreground">
          Messages will disappear after 24 hours
        </p>
      )}

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};