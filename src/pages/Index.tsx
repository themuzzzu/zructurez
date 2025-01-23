import { Navbar } from "@/components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <h1 className="text-4xl font-bold">Welcome Home</h1>
      </div>
    </div>
  );
};

export default Home;