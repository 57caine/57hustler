import campaignsData from '@/data/campaigns.json';

export type CampaignConfidence = 'confirmed' | 'predicted';

export interface Campaign {
  id: string;
  platform: 'rakuten';
  type: 'marathon' | 'super-sale' | 'other';
  name: string;
  entryStartAt?: string;
  startAt: string;
  endAt: string;
  entryRequired: boolean;
  entryUrl?: string;
  officialUrl: string;
  note: string;
  confidence: CampaignConfidence;
}

export interface CampaignStatus {
  campaign: Campaign;
  phase: 'ongoing' | 'upcoming' | 'ended';
  daysUntilStart: number;
  daysUntilEnd: number;
}

export const campaigns: Campaign[] = campaignsData.campaigns as Campaign[];
export const campaignsUpdatedAt: string = campaignsData.updatedAt;
export const campaignsSource: string = campaignsData.source;

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((to.getTime() - from.getTime()) / msPerDay);
}

export function getCampaignStatus(campaign: Campaign, now: Date = new Date()): CampaignStatus {
  const start = new Date(campaign.startAt);
  const end = new Date(campaign.endAt);

  let phase: CampaignStatus['phase'];
  if (now < start) phase = 'upcoming';
  else if (now <= end) phase = 'ongoing';
  else phase = 'ended';

  return {
    campaign,
    phase,
    daysUntilStart: daysBetween(now, start),
    daysUntilEnd: daysBetween(now, end),
  };
}

export function getSortedCampaignStatuses(now: Date = new Date()): CampaignStatus[] {
  return campaigns
    .map((c) => getCampaignStatus(c, now))
    .filter((s) => s.phase !== 'ended')
    .sort((a, b) => new Date(a.campaign.startAt).getTime() - new Date(b.campaign.startAt).getTime());
}

const JST_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function formatJst(d: Date): string {
  const parts = Object.fromEntries(JST_FORMATTER.formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.month}/${parts.day}(${parts.weekday}) ${parts.hour}:${parts.minute}`;
}

export function formatDateRange(startAt: string, endAt: string): string {
  return `${formatJst(new Date(startAt))} 〜 ${formatJst(new Date(endAt))}`;
}
