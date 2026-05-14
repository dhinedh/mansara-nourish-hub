import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: any;
}

const SEO: React.FC<SEOProps> = ({
  title = "Mansara Foods | Healthy Porridge Mixes & Rice Podis from Chennai",
  description = "Pure, traditional, and healthy porridge mixes, health mixes, and idly podis from Mansara Foods, Chennai. Nutritious food for all age groups in Tamil Nadu.",
  keywords = "health mix, porridge mix, urad dal health mix, black rice mix, idly podi, traditional food, healthy breakfast, Mansara Foods, Chennai, Tamil Nadu, organic food India",
  image = "/logo.png",
  url = "https://www.mansarafoods.com",
  type = "website",
  schema
}) => {
  const siteTitle = title.includes("Mansara Foods") ? title : `${title} | Mansara Foods`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Local SEO for Chennai / Tamil Nadu */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Default Local Business Schema */}
      {!schema && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Mansara Foods",
            "image": "https://www.mansarafoods.com/logo.png",
            "@id": "https://www.mansarafoods.com",
            "url": "https://www.mansarafoods.com",
            "telephone": "+91-XXXXXXXXXX",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Address details here",
              "addressLocality": "Chennai",
              "addressRegion": "TN",
              "postalCode": "600XXX",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 13.0827,
              "longitude": 80.2707
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
