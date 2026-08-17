/**
 * Helper to get the correct avatar image URL for a user.
 * If user has custom avatar_url, returns it (resolving relative paths to API base URL if needed).
 * Otherwise falls back to DiceBear SVG with user's email or name as the seed.
 */
export const getAvatarUrl = (userOrAvatar, email, name) => {
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5005').replace(/\/$/, '');

  if (userOrAvatar && typeof userOrAvatar === 'object') {
    if (userOrAvatar.avatar_url && typeof userOrAvatar.avatar_url === 'string' && userOrAvatar.avatar_url.trim().length > 0) {
      const url = userOrAvatar.avatar_url.trim();
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
      }
      return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    const seed = encodeURIComponent(userOrAvatar.email || userOrAvatar.name || 'Scholar');
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;
  }

  if (typeof userOrAvatar === 'string' && userOrAvatar.trim().length > 0) {
    const url = userOrAvatar.trim();
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  const seed = encodeURIComponent(email || name || 'Scholar');
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;
};
