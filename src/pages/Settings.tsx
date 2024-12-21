import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ProfileView } from "@/components/ProfileView";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]" />
          <main className="flex-1 max-w-2xl mx-auto lg:mx-0">
            <ProfileView />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;