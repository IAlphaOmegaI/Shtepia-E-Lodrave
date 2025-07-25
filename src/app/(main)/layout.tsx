import Header from '@/components/layouts/header';
import Footer from '@/components/layouts/footer/footer-bar';
import { SettingsProvider } from '@/contexts/settings.context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <Header />
      
      {/* Main content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </SettingsProvider>
  );
}