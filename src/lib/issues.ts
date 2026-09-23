export interface Issue {
  slug: string;
  label: string;
  s3Key: string;
}

// Newest first — the first entry is the default when no issue is specified.
export const ISSUES: Issue[] = [
  { slug: '3', label: 'Issue 3', s3Key: 'community-issue-3.pdf' },
  { slug: '2', label: 'Issue 2', s3Key: 'community-issue-2.pdf' },
];

export const LATEST_ISSUE = ISSUES[0];

export function getIssue(slug?: string | null): Issue {
  return ISSUES.find((issue) => issue.slug === slug) ?? LATEST_ISSUE;
}
