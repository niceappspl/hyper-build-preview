export function generateSlug(text: string | undefined): string {
  if (!text) {
    return `project-${Date.now()}`;  // Fallback dla undefined lub pustego stringa
  }
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Zamienia spacje na myślniki
    .replace(/[^\w\-]+/g, '')    // Usuwa znaki specjalne
    .replace(/\-\-+/g, '-')      // Zamienia wielokrotne myślniki na pojedyncze
    .replace(/^-+/, '')          // Usuwa myślniki z początku
    .replace(/-+$/, '');         // Usuwa myślniki z końca
}

export function generateProjectUrlId(name: string | undefined): string {
  const slug = generateSlug(name);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomSuffix}`;
}

/**
 * Extracts the original ID from a project URL slug
 * @param urlId Combined project URL ID
 * @returns Original project ID
 */
export const extractProjectId = (urlId: string): string => {
  // The ID is everything before the first dash
  const dashIndex = urlId.indexOf('-');
  return dashIndex > 0 ? urlId.substring(0, dashIndex) : urlId;
};

/**
 * Generates a unique random string that can be used as an ID
 * @param length Length of ID to generate
 * @returns Random alphanumeric ID
 */
export const generateUniqueId = (length: number = 8): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 