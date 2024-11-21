import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const SAMPLE_POSTS = [
  {
    author: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "2h ago",
    content: "Has anyone seen my orange tabby cat? He's been missing since this morning and was last seen near Oak Street Park. He responds to 'Tiger' and is wearing a blue collar.",
    category: "Lost & Found",
    likes: 12,
    comments: 8,
  },
  {
    author: "Mike Peterson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    time: "4h ago",
    content: "Organizing a neighborhood cleanup this Saturday at 9 AM. Meeting at the community center. Bring gloves if you have them! Refreshments will be provided. 🧤♻️",
    category: "Events",
    likes: 24,
    comments: 15,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    author: "Lisa Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    time: "6h ago",
    content: "Selling my gently used patio furniture set. Includes 4 chairs and a table. Perfect condition, just moving and can't take it with me. $200 OBO. DM for more details!",
    category: "For Sale",
    likes: 8,
    comments: 6,
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800",
  },
  {
    author: "David Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    time: "8h ago",
    content: "⚠️ Heads up neighbors! There have been reports of car break-ins on Maple Avenue last night. Remember to lock your cars and don't leave valuables visible.",
    category: "Safety",
    likes: 45,
    comments: 32,
  },
  {
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    time: "12h ago",
    content: "Can anyone recommend a reliable plumber? Have a leaky faucet that needs fixing ASAP. Preferably someone who can come this week. Thanks in advance!",
    category: "Recommendations",
    likes: 3,
    comments: 12,
  },
  {
    author: "Tom Bradley",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    time: "1d ago",
    content: "Just moved to the neighborhood! Looking forward to meeting everyone. We're the new family at 342 Pine Street. Feel free to stop by and say hi! 👋",
    category: "General",
    likes: 56,
    comments: 28,
  },
  {
    author: "Rachel Green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    time: "1d ago",
    content: "The local farmer's market is back this Sunday! 9 AM - 2 PM at Central Park. Lots of fresh produce, baked goods, and crafts. Support our local vendors! 🥕🍎",
    category: "Events",
    likes: 34,
    comments: 16,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
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
      <main className="container max-w-2xl pt-24 pb-12">
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <CreatePost />
        <CategoryFilter />
        <div className="space-y-4">
          {SAMPLE_POSTS.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
