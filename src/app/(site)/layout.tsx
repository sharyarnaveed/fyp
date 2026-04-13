import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/contexts/LocationContext";
import { Analytics } from '@vercel/analytics/react';
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LocationProvider>
      <Navbar />
      <main id="main-content">{children}</main>
         <Analytics />
      <Footer />
    </LocationProvider>
  );
}
