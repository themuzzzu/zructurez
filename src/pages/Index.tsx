import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

const SAMPLE_POSTS = [
  {
    author: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "Just now",
    content: "🐱 URGENT: Has anyone seen my orange tabby cat? He's been missing since this morning and was last seen near Oak Street Park. He responds to 'Tiger' and is wearing a blue collar with a bell. Please contact me if you spot him! Offering reward for safe return.",
    category: "Lost & Found",
    likes: 12,
    comments: 8,
  },
  {
    author: "Mike Peterson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    time: "2h ago",
    content: "🌍 Join us for our monthly neighborhood cleanup this Saturday! We're focusing on the park and main streets.\n\n🕒 Time: 9 AM - 12 PM\n📍 Meeting Point: Community Center\n🧤 Bring: Gloves and water bottle\n🍕 Post-cleanup pizza party for all volunteers!\n\nLet's make our neighborhood shine! ✨",
    category: "Events",
    likes: 45,
    comments: 23,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    author: "Lisa Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    time: "3h ago",
    content: "🛋️ Moving Sale! Everything must go by this weekend:\n\n- Leather sectional sofa (2 years old) - $800\n- Dining table with 6 chairs - $400\n- 55\" Smart TV - $300\n- Coffee maker (barely used) - $50\n\nAll items in excellent condition. Pickup only. DM for photos and details!",
    category: "For Sale",
    likes: 18,
    comments: 32,
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800",
  },
  {
    author: "David Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    time: "4h ago",
    content: "⚠️ SAFETY ALERT: Multiple car break-ins reported last night on Maple Avenue and surrounding streets. My security camera caught footage of suspicious activity around 2 AM. Already reported to police.\n\nReminders:\n- Lock your vehicles\n- Remove valuables\n- Keep exterior lights on\n- Report suspicious activity",
    category: "Safety",
    likes: 89,
    comments: 56,
  },
  {
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    time: "5h ago",
    content: "🔧 Need recommendations for a reliable plumber ASAP! My kitchen sink is completely blocked and starting to leak. Looking for someone who can come today or tomorrow. Please share your experiences and contact info of trusted professionals. Thank you!",
    category: "Recommendations",
    likes: 7,
    comments: 15,
  },
  {
    author: "Tom Bradley",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    time: "6h ago",
    content: "👋 New to the neighborhood! Just moved in at 342 Pine Street with my wife and two kids. We're excited to be part of this community! Looking forward to meeting everyone at local events. We love outdoor activities, board games, and BBQs. Feel free to stop by and say hello!",
    category: "General",
    likes: 65,
    comments: 42,
  },
  {
    author: "Rachel Green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    time: "8h ago",
    content: "🌟 Weekend Highlights from the Farmer's Market!\n\n- Fresh organic produce from local farms\n- Homemade jams and preserves\n- Artisanal bread and pastries\n- Live music by local artists\n- Kids' face painting booth\n\nEvery Sunday, 9 AM - 2 PM at Central Park. Don't miss out! 🥕🍎",
    category: "Events",
    likes: 34,
    comments: 16,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
  },
  {
    author: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    time: "12h ago",
    content: "📚 Starting a neighborhood book club! First meeting will be next Thursday at 7 PM in the community center. We'll be reading 'The Midnight Library' by Matt Haig. Light refreshments provided. All reading enthusiasts welcome! RSVP in the comments.",
    category: "Events",
    likes: 28,
    comments: 20,
  }
];

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!isDark).toString());
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <main className="container max-w-2xl pt-28 pb-16">
        <div className="space-y-12">
          <section className="space-y-6">
            <CreatePost />
          </section>

          <section className="space-y-6">
            <CategoryFilter />
          </section>

          <Separator className="my-8" />

          <section className="space-y-8">
            {SAMPLE_POSTS.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </section>
        </div>
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background"
          onClick={toggleDarkMode}
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Index;