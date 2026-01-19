// JSON-LD Structured Data Components for SEO and LLM optimization

const siteUrl = process.env.NEXTAUTH_URL || "https://apartmentrater.com";

// Organization Schema - Used in root layout
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Apartment Rater",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Apartment Rater helps renters find the perfect apartment through honest reviews from real tenants. Get detailed ratings on noise, management, maintenance, safety, and more.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${siteUrl}/contact`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema with SearchAction for search engines
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Apartment Rater",
    url: siteUrl,
    description:
      "Read and write honest reviews of apartments from real tenants. Find the perfect apartment with detailed ratings.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/apartments?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Apartment/LocalBusiness Schema with AggregateRating
interface ApartmentSchemaProps {
  apartment: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    description?: string | null;
    imageUrl?: string | null;
    averageRating?: number | null;
    reviewCount: number;
    propertyType?: string;
  };
}

export function ApartmentSchema({ apartment }: ApartmentSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${siteUrl}/apartments/${apartment.id}`,
    name: apartment.name,
    description:
      apartment.description ||
      `${apartment.name} is a ${apartment.propertyType || "apartment"} located at ${apartment.address}, ${apartment.city}, ${apartment.state} ${apartment.zipCode}. Read reviews from real tenants.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: apartment.address,
      addressLocality: apartment.city,
      addressRegion: apartment.state,
      postalCode: apartment.zipCode,
      addressCountry: "US",
    },
    url: `${siteUrl}/apartments/${apartment.id}`,
  };

  if (apartment.imageUrl) {
    schema.image = apartment.imageUrl;
  }

  if (apartment.averageRating && apartment.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: apartment.averageRating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: apartment.reviewCount,
      reviewCount: apartment.reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Review Schema
interface ReviewSchemaProps {
  review: {
    id: string;
    title: string;
    experienceSummary: string;
    overallRating: number;
    createdAt: Date | string;
    user: {
      name?: string | null;
    };
    anonymous: boolean;
  };
  apartmentName: string;
  apartmentId: string;
}

export function ReviewSchema({
  review,
  apartmentName,
  apartmentId,
}: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "ApartmentComplex",
      name: apartmentName,
      "@id": `${siteUrl}/apartments/${apartmentId}`,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.overallRating,
      bestRating: "5",
      worstRating: "1",
    },
    name: review.title,
    reviewBody: review.experienceSummary,
    datePublished: new Date(review.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: review.anonymous ? "Anonymous" : review.user.name || "Tenant",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Page Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ItemList Schema for apartment listings
interface ApartmentListItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  averageRating?: number | null;
}

interface ApartmentListSchemaProps {
  apartments: ApartmentListItem[];
  listName?: string;
}

export function ApartmentListSchema({
  apartments,
  listName = "Apartment Listings",
}: ApartmentListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: apartments.length,
    itemListElement: apartments.map((apt, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ApartmentComplex",
        "@id": `${siteUrl}/apartments/${apt.id}`,
        name: apt.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: apt.address,
          addressLocality: apt.city,
          addressRegion: apt.state,
        },
        ...(apt.averageRating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: apt.averageRating.toFixed(1),
          },
        }),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
