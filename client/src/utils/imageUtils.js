const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const resolveProductImage = (imgUrl, fallback = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80') => {
  if (!imgUrl) return fallback;
  // Intercept the masala spice image so it never shows to customers
  if (imgUrl.includes('photo-1596040033229-a9821ebd058d')) {
    return fallback;
  }
  if (imgUrl.startsWith('data:') || imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  if (imgUrl.startsWith('/uploads/')) {
    return BACKEND_URL ? `${BACKEND_URL}${imgUrl}` : imgUrl;
  }
  return imgUrl;
};

// Client-side instant image compression (converts 10MB to ~150KB HD image)
export const compressImageFile = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve({ file, dataUrl: '' });
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob((blob) => {
          if (!blob) {
            return resolve({ file, dataUrl });
          }
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve({ file: compressedFile, dataUrl });
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve({ file, dataUrl: event.target.result });
      img.src = event.target.result;
    };
    reader.onerror = () => resolve({ file, dataUrl: '' });
    reader.readAsDataURL(file);
  });
};

