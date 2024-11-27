import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_GROUPS = [
  {
    id: 1,
    name: "Neighborhood Watch",
    members: 156,
    description: "Keep our community safe and informed about local security matters.",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800"
  },
  {
    id: 2,
    name: "Local Events & Activities",
    members: 342,
    description: "Share and discover exciting events happening in our area.",
    image: "https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=800"
  },
  {
    id: 3,
    name: "Community Garden Club",
    members: 89,
    description: "Tips, advice, and meetups for local gardening enthusiasts.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800"
  }
];

const Groups = () => {
  const handleJoinGroup = (groupId: number) => {
    toast.success("Group joined successfully!");
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
                <h1 className="text-3xl font-bold">Groups</h1>
                <Button onClick={() => toast.info("Create group feature coming soon!")}>
                  Create Group
                </Button>
              </div>
              
              <CreatePost />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_GROUPS.map((group) => (
                  <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
                      <p className="text-muted-foreground mb-4">{group.description}</p>
                      <Button 
                        className="w-full"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join Group
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