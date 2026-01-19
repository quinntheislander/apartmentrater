import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OrganizationSchema } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXTAUTH_URL || "https://apartmentrater.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apartment Rater - Find Your Perfect Home with Honest Reviews",
    template: "%s | Apartment Rater",
  },
  description:
    "Read and write honest reviews of apartments from real tenants. Find the perfect apartment with detailed ratings on noise, management, maintenance, safety, and more. Make informed rental decisions.",
  keywords: [
    "apartment reviews",
    "rental reviews",
    "apartment ratings",
    "tenant reviews",
    "find apartments",
    "apartment search",
    "rental ratings",
    "housing reviews",
    "apartment finder",
    "real tenant reviews",
  ],
  authors: [{ name: "Apartment Rater" }],
  creator: "Apartment Rater",
  publisher: "Apartment Rater",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Apartment Rater",
    title: "Apartment Rater - Find Your Perfect Home with Honest Reviews",
    description:
      "Read and write honest reviews of apartments from real tenants. Find the perfect apartment with detailed ratings on noise, management, maintenance, safety, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apartment Rater - Honest Apartment Reviews from Real Tenants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apartment Rater - Find Your Perfect Home with Honest Reviews",
    description:
      "Read and write honest reviews of apartments from real tenants. Make informed rental decisions with detailed ratings.",
    images: ["/og-image.png"],
    creator: "@apartmentrater",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Real Estate",
  classification: "Apartment Reviews and Ratings",
  other: {
    "application-name": "Apartment Rater",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Apartment Rater",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Providers>
          <a
            href="#main-content"
            className="skip-to-content"
          >
            Skip to main content
          </a>
          <Navbar />
          <main className="flex-1" id="main-content" role="main">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
