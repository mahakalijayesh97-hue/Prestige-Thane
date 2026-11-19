export function parseCdnTags(html: string) {
  if (!html) return [];
  const tags: Array<{ type: 'link' | 'script'; props: Record<string, string>; content?: string }> = [];

  // Match <link ...> tags
  const linkRegex = /<link\s+([^>]+?)\/?>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrString = match[1];
    const props: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      props[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    tags.push({ type: 'link', props });
  }

  // Match <script ...>...</script>
  const scriptRegex = /<script\s*([^>]*)>([\s\S]*?)<\/script>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const attrString = match[1];
    const content = match[2];
    const props: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      props[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    tags.push({ type: 'script', props, content });
  }

  return tags;
}
