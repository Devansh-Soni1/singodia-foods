/**
 * Secure, persistent cookie management utility
 * Used for cookie consent, sessions, cart fallback, and customer preferences.
 */

export const setCookie = (name, value, days = 365) => {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax${secure}`;
  } catch (e) {
    console.warn('Cookie set notice:', e);
  }
};

export const getCookie = (name) => {
  try {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
  } catch (e) {
    console.warn('Cookie get notice:', e);
  }
  return null;
};

export const deleteCookie = (name) => {
  try {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie delete notice:', e);
  }
};
