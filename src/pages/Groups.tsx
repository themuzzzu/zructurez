import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { Sidebar } from "@/components/Sidebar";

const Groups = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block" />
          <main className="flex-1 max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-6">
              <CreatePost />
              {/* Group posts will be added here later */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Groups;