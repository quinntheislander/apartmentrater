import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://apartmentrater.com";

// Helper function to create consistent page metadata
export function createMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image || "/og-image.png";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// Metadata for apartment detail pages (dynamic)
export function createApartmentMetadata(apartment: {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description?: string | null;
  averageRating?: number | null;
  reviewCount: number;
  imageUrl?: string | null;
}): Metadata {
  const ratingText =
    apartment.averageRating && apartment.reviewCount > 0
      ? ` - ${apartment.averageRating.toFixed(1)}/5 rating from ${apartment.reviewCount} reviews`
      : "";

  const title = `${apartment.name} Reviews - ${apartment.city}, ${apartment.state}`;
  const description =
    apartment.description ||
    `Read ${apartment.reviewCount} honest reviews of ${apartment.name} at ${apartment.address}, ${apartment.city}, ${apartment.state} ${apartment.zipCode}${ratingText}. Get detailed ratings on noise, management, maintenance, and more.`;

  return createMetadata({
    title,
    description,
    path: `/apartments/${apartment.id}`,
    image: apartment.imageUrl || undefined,
  });
}

// Pre-defined metadata for static pages
export const staticMetadata = {
  home: createMetadata({
    title: "Apartment Rater - Find Your Perfect Home with Honest Reviews",
    description:
      "Read and write honest reviews of apartments from real tenants. Find the perfect apartment with detailed ratings on noise, management, maintenance, safety, and more. Make informed rental decisions.",
    path: "",
  }),

  apartments: createMetadata({
    title: "Search Apartments - Browse Reviews and Ratings",
    description:
      "Search and browse apartment reviews by location. Find detailed tenant ratings on noise levels, management quality, maintenance response, safety, and more to make informed rental decisions.",
    path: "/apartments",
  }),

  addApartment: createMetadata({
    title: "Add an Apartment",
    description:
      "Add a new apartment to Apartment Rater. Help other renters by sharing information about an apartment that hasn't been reviewed yet.",
    path: "/apartments/add",
    noIndex: true,
  }),

  about: createMetadata({
    title: "About Us",
    description:
      "Learn about Apartment Rater's mission to help renters make informed decisions through honest, verified tenant reviews and comprehensive apartment ratings.",
    path: "/about",
  }),

  contact: createMetadata({
    title: "Contact Us",
    description:
      "Get in touch with the Apartment Rater team. We're here to help with questions, feedback, or support regarding apartment reviews and ratings.",
    path: "/contact",
  }),

  faq: createMetadata({
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about Apartment Rater, including how to write reviews, how ratings work, and how we verify tenant reviews.",
    path: "/faq",
  }),

  howItWorks: createMetadata({
    title: "How It Works",
    description:
      "Learn how Apartment Rater helps you find the perfect apartment. Discover how to search, read reviews, write your own reviews, and use our rating system.",
    path: "/how-it-works",
  }),

  privacy: createMetadata({
    title: "Privacy Policy",
    description:
      "Read Apartment Rater's privacy policy. Learn how we collect, use, and protect your personal information when you use our apartment review platform.",
    path: "/privacy",
  }),

  terms: createMetadata({
    title: "Terms of Service",
    description:
      "Read Apartment Rater's terms of service. Understand the rules and guidelines for using our apartment review and rating platform.",
    path: "/terms",
  }),

  guidelines: createMetadata({
    title: "Community Guidelines",
    description:
      "Review Apartment Rater's community guidelines for writing honest, helpful apartment reviews that benefit other renters.",
    path: "/guidelines",
  }),

  accessibility: createMetadata({
    title: "Accessibility Statement",
    description:
      "Learn about Apartment Rater's commitment to digital accessibility and how we work to make our platform usable for everyone.",
    path: "/accessibility",
  }),

  cookies: createMetadata({
    title: "Cookie Policy",
    description:
      "Understand how Apartment Rater uses cookies and similar technologies to improve your experience on our apartment review platform.",
    path: "/cookies",
  }),

  dmca: createMetadata({
    title: "DMCA Notice",
    description:
      "Information about reporting copyright infringement and DMCA takedown requests on Apartment Rater.",
    path: "/dmca",
  }),

  dataRequest: createMetadata({
    title: "Data Request",
    description:
      "Request access to your personal data or submit a data deletion request in accordance with privacy regulations.",
    path: "/data-request",
    noIndex: true,
  }),

  signin: createMetadata({
    title: "Sign In",
    description:
      "Sign in to your Apartment Rater account to write reviews, save favorites, and manage your apartment ratings.",
    path: "/auth/signin",
    noIndex: true,
  }),

  signup: createMetadata({
    title: "Create Account",
    description:
      "Create a free Apartment Rater account to write apartment reviews, save your favorites, and help other renters find their perfect home.",
    path: "/auth/signup",
    noIndex: true,
  }),

  dashboard: createMetadata({
    title: "Dashboard",
    description:
      "View and manage your apartment reviews, saved favorites, and account activity on Apartment Rater.",
    path: "/dashboard",
    noIndex: true,
  }),

  favorites: createMetadata({
    title: "Saved Apartments",
    description:
      "View your saved apartments and favorites on Apartment Rater. Keep track of apartments you're interested in.",
    path: "/favorites",
    noIndex: true,
  }),

  profile: createMetadata({
    title: "Profile Settings",
    description: "Manage your Apartment Rater account settings and profile information.",
    path: "/profile",
    noIndex: true,
  }),
};
