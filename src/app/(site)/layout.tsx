import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/contexts/LocationContext";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LocationProvider>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </LocationProvider>
  );
}
