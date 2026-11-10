import React from 'react';

export const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const YouTubeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    label: '@singodiafoods',
    url: 'https://www.instagram.com/singodiafoods?obrf=Y3l0aGw1enh2bTl6',
    icon: InstagramIcon,
    bgClass: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white',
    badgeClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
    colorHex: '#E1306C'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    label: '@singodiafoods',
    url: 'https://youtube.com/@singodiafoods?si=a4PR1N-ItrTXdKgx',
    icon: YouTubeIcon,
    bgClass: 'hover:bg-[#FF0000] hover:text-white',
    badgeClass: 'bg-[#FF0000] text-white',
    colorHex: '#FF0000'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    label: 'Singodia Foods',
    url: 'https://www.facebook.com/share/1DTfda4oNd/',
    icon: FacebookIcon,
    bgClass: 'hover:bg-[#1877F2] hover:text-white',
    badgeClass: 'bg-[#1877F2] text-white',
    colorHex: '#1877F2'
  }
];

/**
 * SocialLinks component
 * @param {'icons' | 'buttons' | 'footer'} variant
 */
export const SocialLinks = ({ variant = 'icons', className = '' }) => {
  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {SOCIAL_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Singodia Foods on ${item.name}`}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 shadow-xs ${item.badgeClass}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {SOCIAL_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Singodia Foods on ${item.name}`}
              title={`${item.name}: ${item.label}`}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-cream-100 flex items-center justify-center transition-all transform hover:scale-110 hover:text-mustard"
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    );
  }

  // Default: round icons with brand colors on hover
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Singodia Foods on ${item.name}`}
            title={`Follow on ${item.name}`}
            className={`w-9 h-9 rounded-full bg-cream-100 text-charcoal flex items-center justify-center transition-all transform hover:scale-110 shadow-xs ${item.bgClass}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
