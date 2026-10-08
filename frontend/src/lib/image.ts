export const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
export const DEFAULT_AVATAR_IMAGE = 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff';

export const safeImage = (value: unknown, fallback = DEFAULT_PROPERTY_IMAGE): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

export const safeImageList = (values: unknown, fallback = DEFAULT_PROPERTY_IMAGE): string[] => {
  const list = Array.isArray(values)
    ? values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0).map(value => value.trim())
    : [];
  return list.length ? list : [fallback];
};
