import React, { useEffect } from 'react';
import { ToolMeta, FAQItem, BreadcrumbItem } from '../types';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  toolMeta?: ToolMeta;
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  toolMeta,
  faqs = [],
  breadcrumbs = []
}) => {
  const domain = 'https://splitdrop.com';
  const fullUrl = `${domain}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to set meta tag
    const setMeta = (nameAttr: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper for link rel
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Meta descriptions
    setMeta('name', 'description', description);

    // Google Search Console Verification (Preserve)
    setMeta('name', 'google-site-verification', 'd81652f9a9bf28726b372385ee394877_splitdrop_verify');

    // Canonical
    setLink('canonical', fullUrl);

    // OpenGraph
    setMeta('property', 'og:site_name', 'SplitDrop');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:image', `${domain}/og-image.png`);

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${domain}/og-image.png`);

    // JSON-LD Schemas
    const schemas: object[] = [
      // WebSite + SearchAction
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'SplitDrop',
        'url': domain,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${domain}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      // Organization
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'SplitDrop',
        'url': domain,
        'logo': `${domain}/icon.svg`,
        'sameAs': ['https://github.com/splitdrop']
      }
    ];

    // Tool SoftwareApplication Schema
    if (toolMeta) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': toolMeta.title,
        'operatingSystem': 'All',
        'applicationCategory': toolMeta.category === 'PDF Tools' ? 'PDFApplication' : 'UtilitiesApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': toolMeta.description
      });
    }

    // FAQ Schema
    if (faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      });
    }

    // Breadcrumb Schema
    if (breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': crumb.label,
          'item': crumb.path ? `${domain}${crumb.path}` : fullUrl
        }))
      });
    }

    // Inject Script JSON-LD
    let scriptEl = document.getElementById('json-ld-schema');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'json-ld-schema';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);

  }, [title, description, fullUrl, toolMeta, faqs, breadcrumbs]);

  return null;
};
