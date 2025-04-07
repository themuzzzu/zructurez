
import { Layout } from "./Layout";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 max-w-6xl mx-auto">
        {/* Main Content */}
        <main className="col-span-1 md:col-span-12 lg:col-span-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </Layout>
  );
}
