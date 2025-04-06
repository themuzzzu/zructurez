
import { Layout } from "./Layout";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </Layout>
  );
}
