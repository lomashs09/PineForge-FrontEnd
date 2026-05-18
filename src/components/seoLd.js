export const SITE_URL = 'https://getpineforge.com';
export const SITE_NAME = 'PineForge';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: ['https://github.com/lomashs09/PineForge'],
};

export const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export function buildBreadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function buildArticleLd(post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.image ? `${SITE_URL}${post.image}` : DEFAULT_OG_IMAGE;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.keywords?.join(', '),
  };
}

export function buildFaqLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// Question-pattern regex — matches H2 headings that look like FAQ questions.
// We use these to extract Q/A pairs from markdown post content so the
// FAQPage schema is generated automatically without per-post manual work.
const FAQ_H2_PATTERN = /^##\s+((?:What|How|Why|Should|Can|Is|Are|Do|Does|Which|When|Where|Who)\b[^\n]*\?)\s*$/gim;

// Extract FAQ-style H2 questions + their answers from markdown content.
// Returns [{ q, a }] suitable for buildFaqLd. Answers are stripped of
// markdown formatting and truncated to ~600 chars for SERP eligibility.
export function extractFaqsFromMarkdown(markdown, maxFaqs = 6) {
  if (!markdown) return [];

  const matches = [];
  let m;
  FAQ_H2_PATTERN.lastIndex = 0;
  while ((m = FAQ_H2_PATTERN.exec(markdown)) !== null) {
    matches.push({ question: m[1].trim(), startIndex: m.index + m[0].length });
  }
  if (matches.length === 0) return [];

  const faqs = [];
  for (let i = 0; i < matches.length && faqs.length < maxFaqs; i++) {
    const start = matches[i].startIndex;
    // Answer runs until the next H2 or end of content.
    const nextH2 = markdown.indexOf('\n## ', start);
    const end = nextH2 === -1 ? markdown.length : nextH2;
    const rawAnswer = markdown.slice(start, end).trim();
    const cleanAnswer = stripMarkdown(rawAnswer);
    if (cleanAnswer.length < 40) continue; // skip too-short
    faqs.push({
      q: matches[i].question,
      a: cleanAnswer.length > 600 ? cleanAnswer.slice(0, 597) + '...' : cleanAnswer,
    });
  }
  return faqs;
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')           // remove fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')     // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // unwrap links
    .replace(/[*_`]+/g, '')                   // strip emphasis markers
    .replace(/^[-*+]\s+/gm, '')               // strip list bullets
    .replace(/^#{1,6}\s+/gm, '')              // strip remaining headings
    .replace(/\s+/g, ' ')                     // collapse whitespace
    .trim();
}
