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