import { useEffect } from 'react';

const DEFAULT_TITLE = 'Singodia Foods — शुद्ध मारवाड़ी देसी अचार | Sujangarh, Rajasthan';
const DEFAULT_DESC = 'Authentic homemade Rajasthani pickles hand-crafted with traditional recipes, cold-pressed mustard oil, and sun-cured in ceramic martabans in Sujangarh, Rajasthan. 100% preservative-free.';
const DEFAULT_KEYWORDS = 'rajasthani achar, homemade pickle, aam ka achar, banarasi lal mirch, kair sangri, pure mustard oil pickle, sujangarh achar, singodia foods';
const DEFAULT_IMAGE = 'https://singodiafoodstore.in/hero-banner.png';
const SITE_NAME = 'Singodia Foods';

export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema = null
} = {}) => {
  useEffect(() => {
    // 1. Dynamic document title
    const finalTitle = title 
      ? (title.includes('Singodia Foods') ? title : `${title} | Singodia Foods`)
      : DEFAULT_TITLE;
    document.title = finalTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const finalDesc = description || DEFAULT_DESC;
    const finalKeywords = keywords || DEFAULT_KEYWORDS;
    const finalImage = image ? (image.startsWith('http') ? image : `https://singodiafoodstore.in${image}`) : DEFAULT_IMAGE;
    const finalUrl = url ? (url.startsWith('http') ? url : `https://singodiafoodstore.in${url}`) : window.location.href;

    // Standard Meta Tags
    setMetaTag('name', 'description', finalDesc);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'author', 'Singodia Foods, Sujangarh, Rajasthan');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // OpenGraph (Facebook, WhatsApp, LinkedIn, Instagram preview)
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:url', finalUrl);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_IN');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', finalImage);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

    // 3. Dynamic JSON-LD Structured Data
    let schemaScript = document.getElementById('seo-dynamic-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-dynamic-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    if (schema) {
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      // Default WebSite & Organization Schema
      const defaultSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://singodiafoodstore.in/#organization',
            'name': 'Singodia Foods',
            'url': 'https://singodiafoodstore.in',
            'logo': 'https://singodiafoodstore.in/logo.png',
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+91-7597966707',
              'contactType': 'customer support',
              'areaServed': 'IN',
              'availableLanguage': ['Hindi', 'English']
            },
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Sujangarh',
              'addressRegion': 'Rajasthan',
              'postalCode': '331507',
              'addressCountry': 'IN'
            }
          },
          {
            '@type': 'WebSite',
            '@id': 'https://singodiafoodstore.in/#website',
            'url': 'https://singodiafoodstore.in',
            'name': 'Singodia Foods',
            'publisher': { '@id': 'https://singodiafoodstore.in/#organization' },
            'inLanguage': 'hi-IN'
          }
        ]
      };
      schemaScript.textContent = JSON.stringify(defaultSchema);
    }
  }, [title, description, keywords, image, url, type, schema]);
};

export default useSEO;
