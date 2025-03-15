export interface FaqItem {
  id: string;
  title: string;
  menuTitle?: string;  // Optional shorter title for menu
}

export interface FaqNavItem {
  href: string;
  label: string;
}

export const faqItems: FaqItem[] = [
  { id: "breaking-changes", title: "What are breaking changes?" },
  { id: "detect-changes", title: "Using oasdiff to detect changes" },
  { id: "prevent-breaking", title: "Using oasdiff to prevent changes" },
  { id: "cicd", title: "Integrating oasdiff into CI/CD pipelines", menuTitle: "CI/CD Integration" },
  { id: "diff-service", title: "Diff as a Service" },
  { id: "changelog", title: "Generating a changelog" },
  { id: "formats", title: "Output formats" },
  { id: "raw-diff", title: "Raw diff" },
  { id: "allof-comparison", title: "Comparing AllOf schemas" },
  { id: "maturity-model", title: "API Change Management" },
];

export const faqNavItems: FaqNavItem[] = faqItems.map(item => ({
  href: `/faq#${item.id}`,
  label: item.menuTitle || item.title
})); 