import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";
import { GroupManagement } from "@/components/groups/GroupManagement";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex">
          <Sidebar className="hidden lg:block w-64 fixed h-[calc(100vh-4rem)]" />
          <main className="flex-1 lg:ml-64">
            <div className="container max-w-[1200px] p-4 space-y-4">
              <CreatePost />
              <div className="my-8">
                <h2 className="text-2xl font-bold mb-4">Groups</h2>
                <GroupManagement />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;