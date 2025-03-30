
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HomeLayout } from "@/components/layout/HomeLayout";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full">
        {/* Main Content */}
        <HomeLayout>
          <div className="py-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              <p className="text-muted-foreground">Content from the previous home page</p>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => navigate("/businesses")} 
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Browse Business Listings
                </button>
              </div>
            </div>
          </div>
        </HomeLayout>
      </main>
    </div>
  );
}
