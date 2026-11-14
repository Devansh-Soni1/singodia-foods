/**
 * Enterprise-grade Security & Rate Limiting Middleware
 * Protects Singodia Foods API from scrapers, brute force, DDoS, and unauthorized data leakage.
 */

// In-memory sliding window rate limiter stores
const rateLimitStores = new Map();

/**
 * Creates a configurable in-memory rate limiter
 * @param {Object} options - { windowMs, max, message }
 */
export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 100,
  message = 'बहुत अधिक अनुरोध (Too many requests). कृपया थोड़ी देर बाद प्रयास करें।'
}) => {
  const store = new Map();

  // Periodic garbage collection every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now - record.startTime > windowMs) {
        store.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  return (req, res, next) => {
    const clientIp = 
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
      req.headers['x-real-ip'] || 
      req.socket.remoteAddress || 
      'unknown-ip';

    const now = Date.now();
    const record = store.get(clientIp);

    if (!record || (now - record.startTime > windowMs)) {
      store.set(clientIp, { startTime: now, count: 1 });
      return next();
    }

    if (record.count >= max) {
      res.setHeader('Retry-After', Math.ceil((windowMs - (now - record.startTime)) / 1000));
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message
      });
    }

    record.count += 1;
    next();
  };
};

// 1. General API Rate Limiter: Max 150 requests per minute per IP
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 150,
  message: 'सुरक्षा कारणों से आपकी गति सीमित की गई है। कृपया 1 मिनट बाद पुनः प्रयास करें।'
});

// 2. Strict Auth & OTP Limiter: Max 8 attempts per 15 minutes per IP
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: 'गलत प्रयासों की सीमा समाप्त। सुरक्षा कारणों से 15 मिनट के लिए लॉगिन अस्थायी रूप से ब्लॉक है।'
});

// 3. Order Placement Limiter: Max 6 orders per 10 minutes per IP
export const orderRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 6,
  message: 'आप कम समय में बहुत अधिक ऑर्डर कर रहे हैं। कृपया कुछ देर प्रतीक्षा करें।'
});

// 4. HTTP Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking / framing
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Remove Express identification
  res.removeHeader('X-Powered-By');
  next();
};

// 5. Bot & Bad User-Agent Blocker
export const botScraperProtection = (req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  
  // Known aggressive scraper / crawler bot signatures
  const blockedUAs = [
    'sqlmap', 'nikto', 'curb', 'masscan', 'nmap', 'dirbuster',
    'scrapy', 'python-requests', 'aiohttp', 'petalbot', 'bytespider'
  ];

  for (const bot of blockedUAs) {
    if (ua.includes(bot)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Automated scraper or bot detected.'
      });
    }
  }

  next();
};
