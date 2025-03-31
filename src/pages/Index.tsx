
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HomeLayout } from "@/components/layout/HomeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedSection } from "@/components/feed/FeedSection";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("for-you");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full">
        <HomeLayout>
          <div className="py-4 mobile-container px-4 sm:px-6">
            <Tabs defaultValue="for-you" className="w-full mt-4">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger 
                  value="for-you" 
                  onClick={() => setActiveTab("for-you")}
                  className={activeTab === "for-you" ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white" : ""}
                >
                  For You
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  onClick={() => setActiveTab("following")}
                  className={activeTab === "following" ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white" : ""}
                >
                  Following
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="for-you" className="mt-0">
                <FeedSection />
              </TabsContent>
              
              <TabsContent value="following" className="mt-0">
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Follow businesses and people to see their updates here.</p>
                  
                  {!user && (
                    <div className="mt-4">
                      <button 
                        onClick={() => navigate("/auth")} 
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                      >
                        Sign in to get started
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </HomeLayout>
      </main>
    </div>
  );
}
