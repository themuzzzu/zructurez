
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, User, Clock, Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface ProfileCardProps {
  profile?: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    location?: string | null;
    created_at: string;
    updated_at: string;
  };
  isOwnProfile?: boolean;
}

export function ProfileCard({ profile, isOwnProfile = false }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
  });
  const { user } = useAuth();

  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm text-gray-500">Profile not found</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Profile</span>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar_url || undefined} alt="Profile picture" />
            <AvatarFallback>{getInitials(profile.full_name || profile.username)}</AvatarFallback>
          </Avatar>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>
              
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="Your location"
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold">
                {profile.full_name || profile.username || 'Anonymous User'}
              </h2>
              
              {profile.username && (
                <p className="text-gray-500">@{profile.username}</p>
              )}

              {profile.bio && (
                <div className="mt-4 text-center">
                  <p className="text-sm">{profile.bio}</p>
                </div>
              )}

              <div className="w-full mt-6 space-y-2">
                {profile.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {isOwnProfile && !isEditing && (
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
