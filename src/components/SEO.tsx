import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

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
  url,
  type = "website",
  noindex = false,
  schema
}) => {
  const location = useLocation();
  const currentPath = url || (location ? location.pathname : '/');

  // Ensure title is clean and concise (under 60 characters recommended)
  const fullTitle = title.includes("Mansara Foods") ? title : `${title} | Mansara Foods`;
  const cleanTitle = fullTitle.length > 60 ? `${fullTitle.substring(0, 57)}...` : fullTitle;

  // Ensure meta description is concise (under 155 characters)
  const cleanDescription = description.length > 155 ? `${description.substring(0, 152)}...` : description;

  // Strip 24-character hex MongoDB ObjectIds or internal database IDs from keywords
  const cleanKeywords = keywords
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0 && !/^[0-9a-fA-F]{24}$/.test(k))
    .join(', ');

  let absoluteUrl: string;
  if (currentPath.startsWith('http')) {
    absoluteUrl = currentPath;
  } else if (currentPath === '/' || currentPath === '') {
    absoluteUrl = 'https://www.mansarafoods.com/';
  } else {
    const formattedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
    absoluteUrl = `https://www.mansarafoods.com${formattedPath}`;
  }

  const absoluteImage = image.startsWith('http') ? image : `https://www.mansarafoods.com${image.startsWith('/') ? '' : '/'}${image}`;

  // Organization Schema (Sitewide)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mansara Foods",
    "legalName": "MansaraFoods Private Limited",
    "url": "https://www.mansarafoods.com",
    "logo": "https://www.mansarafoods.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-883 888 7064",
      "contactType": "customer service",
      "email": "contact@mansarafoods.com",
      "areaServed": "IN",
      "availableLanguage": ["English", "Tamil"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chennai",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600001",
      "addressCountry": "India"
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
    "telephone": "+91-883 888 7064",
    "email": "contact@mansarafoods.com",
    "priceRange": "₹70 - ₹500",
    "description": "Authentic health mix shop Chennai and traditional food store offering porridge mix delivery Tamil Nadu, idly podi online, and sprouted multigrain wellness products.",
    "areaServed": ["Chennai", "Tamil Nadu", "India", "Worldwide"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chennai",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600001",
      "addressCountry": "India"
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

  // WebSite Schema (Enables Google Sitelinks Search Box eligibility)
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mansara Foods",
    "url": "https://www.mansarafoods.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.mansarafoods.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const customSchemas = schema
    ? (Array.isArray(schema) ? schema : [schema])
    : [localBusinessSchema, webSiteSchema];

  // Organization schema is ALWAYS rendered sitewide
  const schemasToRender = [organizationSchema, ...customSchemas];

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDescription} />
      {cleanKeywords && <meta name="keywords" content={cleanKeywords} />}
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

