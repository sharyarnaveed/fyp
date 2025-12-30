import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";




export const metadata: Metadata = {
  title: "Prepzy",
  description: "AI-Powered Exam Preparation for Students in Pakistan",
  icons:{
    icon:"icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Navbar/>
        <main>
        {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
