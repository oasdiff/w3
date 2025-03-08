export interface FaqItem {
  id: string;
  title: string;
}

export interface FaqNavItem {
  href: string;
  label: string;
}

export const faqItems: FaqItem[] = [
  { id: "breaking-changes", title: "What are breaking changes?" },
  { id: "detect-changes", title: "Using oasdiff to detect changes" },
  { id: "prevent-breaking", title: "Using oasdiff to prevent changes" },
  { id: "cicd", title: "Using oasdiff in CI/CD" },
  { id: "changelog", title: "Generating a changelog" },
  { id: "raw-diff", title: "Raw diff" },
];

export const faqNavItems: FaqNavItem[] = faqItems.map(item => ({
  href: `/faq#${item.id}`,
  label: item.title
})); 