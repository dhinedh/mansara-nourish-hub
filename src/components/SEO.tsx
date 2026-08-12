import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  schema?: any | any[];
}

const SEO: React.FC<SEOProps> = ({
  title = "Traditional Health Mix & Porridge | Mansara Foods",
  description = "Pure traditional health mixes, sprouted urad porridge mixes & authentic idly podis from Mansara Foods Chennai. Order healthy natural food online.",
  keywords = "health mix Chennai, traditional porridge mix, millet health mix India, idly podi online, urad dal porridge, black rice mix, Mansara Foods",
  image = "/logo.png",
  url = "https://www.mansarafoods.com",
  type = "website",
  noindex = false,
  schema
}) => {
  // Ensure title is clean and concise (under 60 characters recommended)
  const fullTitle = title.includes("Mansara Foods") ? title : `${title} | Mansara Foods`;
  const cleanTitle = fullTitle.length > 60 ? `${fullTitle.substring(0, 57)}...` : fullTitle;

  // Ensure meta description is concise (under 155 characters)
  const cleanDescription = description.length > 155 ? `${description.substring(0, 152)}...` : description;

  const absoluteUrl = url.startsWith('http') ? url : `https://www.mansarafoods.com${url.startsWith('/') ? '' : '/'}${url}`;
  const absoluteImage = image.startsWith('http') ? image : `https://www.mansarafoods.com${image.startsWith('/') ? '' : '/'}${image}`;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mansara Foods",
    "legalName": "MansaraFoods Private Limited",
    "url": "https://www.mansarafoods.com",
    "logo": "https://www.mansarafoods.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8838887064",
      "contactType": "customer service",
      "email": "contact@mansarafoods.com",
      "areaServed": "IN",
      "availableLanguage": ["English", "Tamil"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chennai",
      "addressLocality": "Chennai",
      "addressRegion": "TN",
      "postalCode": "600001",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/mansarafoods",
      "https://www.instagram.com/mansarafoods",
      "https://twitter.com/mansarafoods"
    ]
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mansara Foods",
    "image": "https://www.mansarafoods.com/logo.png",
    "@id": "https://www.mansarafoods.com",
    "url": "https://www.mansarafoods.com",
    "telephone": "+91-8838887064",
    "email": "contact@mansarafoods.com",
    "priceRange": "₹70 - ₹500",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chennai",
      "addressLocality": "Chennai",
      "addressRegion": "TN",
      "postalCode": "600001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.0827,
      "longitude": 80.2707
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  const schemasToRender = schema
    ? (Array.isArray(schema) ? schema : [schema])
    : [organizationSchema, localBusinessSchema];

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={absoluteUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={cleanTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="Mansara Foods" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={cleanTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Chennai / Tamil Nadu Local SEO Tags */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      {/* JSON-LD Schemas */}
      {schemasToRender.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
