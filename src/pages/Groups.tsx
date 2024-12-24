import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users2, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Group {
  id: number;
  name: string;
  members: number;
  description: string;
  image: string;
  joined: boolean;
}

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Neighborhood Watch",
      members: 156,
      description: "Keep our community safe and informed about local security matters.",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800",
      joined: false
    },
    {
      id: 2,
      name: "Local Events & Activities",
      members: 342,
      description: "Share and discover exciting events happening in our area.",
      image: "https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=800",
      joined: false
    },
    {
      id: 3,
      name: "Community Garden Club",
      members: 89,
      description: "Tips, advice, and meetups for local gardening enthusiasts.",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
      joined: false
    }
  ]);

  const handleJoinGroup = (groupId: number) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          const newJoinedStatus = !group.joined;
          const memberDelta = newJoinedStatus ? 1 : -1;
          toast.success(newJoinedStatus ? "Successfully joined the group!" : "Left the group");
          return {
            ...group,
            joined: newJoinedStatus,
            members: group.members + memberDelta
          };
        }
        return group;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block" />
          <main className="flex-1">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Link to="/">
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <h1 className="text-3xl font-bold">Groups</h1>
                </div>
                <Button onClick={() => toast.info("Create group feature coming soon!")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-up">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Users2 className="h-4 w-4 mr-2" />
                        {group.members} members
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{group.description}</p>
                      <Button 
                        className="w-full"
                        variant={group.joined ? "destructive" : "default"}
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        {group.joined ? (
                          <>
                            <Minus className="h-4 w-4 mr-2" />
                            Leave Group
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Join Group
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Groups;