import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PostCard } from "@/components/PostCard";

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
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-2xl pt-24 pb-12">
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