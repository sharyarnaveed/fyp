import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prepzy.tech";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050F2A",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prepzy | AI-Powered Exam Preparation for Students in Pakistan",
    template: "%s | Prepzy",
  },
  description:
    "Prepzy helps Pakistani students crack exams with AI study assistant, quiz generator, smart summarization, study planner, and performance tracking. Smarter prep starts here.",
  keywords: [
    "exam preparation Pakistan",
    "AI study assistant",
    "MCQ generator",
    "exam prep",
    "Prepzy",
    "study planner",
    "document summarization",
    "student success",
  ],
  authors: [{ name: "Prepzy", url: siteUrl }],
  creator: "Prepzy",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Prepzy",
    title: "Prepzy | AI-Powered Exam Preparation for Students in Pakistan",
    description:
      "Smart plans, personalized study, and expert tools to help you achieve top results. Crack exams, not your brain.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Prepzy - AI Exam Prep" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepzy | AI-Powered Exam Preparation",
    description: "Smart plans, personalized study, and expert tools for Pakistani students.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: "icon.png" },
  alternates: { canonical: siteUrl },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Prepzy",
      description: "AI-Powered Exam Preparation for Students in Pakistan",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-PK",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Prepzy",
      url: siteUrl,
      slogan: "Smarter Prep Starts Here",
    },
    {
      "@type": "EducationalOrganization",
      name: "Prepzy",
      description: "AI-powered exam preparation platform offering study assistant, quiz generator, document summarization, and study planning for students in Pakistan.",
      url: siteUrl,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
