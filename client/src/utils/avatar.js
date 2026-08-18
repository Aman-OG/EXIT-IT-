/**
 * Helper to get the correct avatar image URL for a user.
 * Supports:
 * - Direct base64 data URLs ('data:image/jpeg;base64,...')
 * - Remote HTTP/HTTPS URLs ('https://...')
 * - Relative uploaded avatar paths ('/uploads/avatars/...') -> prepends backend host
 * - Object representations with avatar_url, avatar, picture, image, profilePicture, profile_picture, user_account_avatar
 * - Fallbacks to deterministic DiceBear SVG using email or name seed.
 */
export const getAvatarUrl = (userOrAvatar, email, name) => {
  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5005';
  const backendBase = rawApiUrl.replace(/\/$/, '').replace(/\/api$/, '');

  // 1. If passed an object representing a user or containing avatar fields
  if (userOrAvatar && typeof userOrAvatar === 'object') {
    const rawUrl = 
      userOrAvatar.avatar_url || 
      userOrAvatar.avatar || 
      userOrAvatar.picture || 
      userOrAvatar.image || 
      userOrAvatar.profilePicture || 
      userOrAvatar.profile_picture ||
      userOrAvatar.user_account_avatar;

    if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
      const url = rawUrl.trim();
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
      }
      return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    const seed = encodeURIComponent(userOrAvatar.email || userOrAvatar.name || email || name || 'Scholar');
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;
  }

  // 2. If passed a direct string URL / path
  if (typeof userOrAvatar === 'string' && userOrAvatar.trim().length > 0) {
    const url = userOrAvatar.trim();
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // 3. Fallback to DiceBear SVG
  const seed = encodeURIComponent(email || name || 'Scholar');
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;
};
