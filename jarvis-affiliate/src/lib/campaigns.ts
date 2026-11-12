import fs from 'node:fs';
import matter from 'gray-matter';
import { p } from './paths.ts';

export interface ComparisonColumn {
  key: string;
  label: string;
  type: 'number' | 'text' | 'boolean';
  unit?: string;
}

export interface Campaign {
  slug: string;
  status: 'draft' | 'published';
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category?: string;
  author?: string;
  target: { persona: string; situation?: string };
  pains: string[];
  benefits: string[];
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline?: string;
    primaryProgramId: string;
    ctaLabel: string;
    microcopy?: string;
  };
  appeals?: { axis: string; message: string }[];
  comparison?: { caption?: string; programIds: string[]; columns: ComparisonColumn[] };
  ranking?: { programId: string; catchcopy: string; reason: string; recommendedFor?: string[] }[];
  faq?: { q: string; a: string }[];
  socialAngles?: string[];
  compliance?: { regulatedCategory?: string; sources?: { label: string; url: string }[] };
  seo?: { keywords?: string[]; ogImage?: string };
  /** Markdown本文（frontmatter以外） */
  body: string;
  /** 元ファイルのパス */
  file: string;
}

const DIR = () => p('content', 'campaigns');

const toDateString = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''));

export function loadCampaigns(opts: { includeDrafts?: boolean } = {}): Campaign[] {
  const files = fs.readdirSync(DIR()).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  return files
    .map((file) => {
      const full = `${DIR()}/${file}`;
      const { data, content } = matter(fs.readFileSync(full, 'utf8'));
      return {
        ...(data as Omit<Campaign, 'body' | 'file'>),
        slug: data.slug ?? file.replace(/\.md$/, ''),
        publishedAt: toDateString(data.publishedAt),
        updatedAt: toDateString(data.updatedAt ?? data.publishedAt),
        body: content,
        file: full,
      } as Campaign;
    })
    .filter((c) => opts.includeDrafts || c.status === 'published')
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** キャンペーンから参照されている全案件ID */
export function referencedProgramIds(c: Campaign): string[] {
  return [
    c.hero?.primaryProgramId,
    ...(c.comparison?.programIds ?? []),
    ...(c.ranking ?? []).map((r) => r.programId),
  ].filter(Boolean) as string[];
}
