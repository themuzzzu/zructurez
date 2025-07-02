
import React, { useState } from "react";
import { Button } from "../ui/button";
import { AvatarWithFallback } from "../common/AvatarWithFallback";

interface User {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
}

export const FollowersTab = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  
  // Mock data
  const followers: User[] = [
    {
      id: "1",
      name: "John Doe",
      username: "@johndoe",
      avatar_url: "/placeholder-avatar.jpg"
    }
  ];

  const following: User[] = [
    {
      id: "2", 
      name: "Jane Smith",
      username: "@janesmith",
      avatar_url: "/placeholder-avatar.jpg"
    }
  ];

  const currentData = activeTab === 'followers' ? followers : following;

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 border-b">
        <button
          className={`pb-2 px-1 ${activeTab === 'followers' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers ({followers.length})
        </button>
        <button
          className={`pb-2 px-1 ${activeTab === 'following' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}
          onClick={() => setActiveTab('following')}
        >
          Following ({following.length})
        </button>
      </div>

      <div className="space-y-3">
        {currentData.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AvatarWithFallback
                src={user.avatar_url}
                name={user.name}
                size="md"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.username}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {activeTab === 'followers' ? 'Follow Back' : 'Unfollow'}
            </Button>
          </div>
        ))}
      </div>

      {currentData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {activeTab} yet
        </div>
      )}
    </div>
  );
};
