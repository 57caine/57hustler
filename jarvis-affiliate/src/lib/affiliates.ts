import fs from 'node:fs';
import { p } from './paths.ts';

export type AspId = 'a8' | 'moshimo' | 'rakuten' | 'amazon' | 'valuecommerce' | 'afb' | 'accesstrade' | 'other';

export interface AffiliateProgram {
  id: string;
  name: string;
  asp: AspId;
  status: 'active' | 'paused' | 'pending';
  dummy?: boolean;
  url: string;
  officialUrl?: string;
  trackingId?: string;
  reward?: { type: 'CPA' | 'CPS' | 'CPC'; amount: number; currency: 'JPY' | 'PERCENT'; condition?: string };
  approvalRate?: number;
  category?: string;
  image?: string;
  specs: Record<string, string | number | boolean | null>;
  highlights?: string[];
  cautions?: string[];
  verifiedAt?: string;
  source?: string;
  notes?: string;
}

export interface AffiliateMaster {
  version: number;
  updatedAt: string;
  programs: AffiliateProgram[];
}

/** ASPごとの「正しいアフィリエイトリンクか」の判定ルール（validate-links.ts でも使用） */
export const ASP_RULES: Record<AspId, { hosts: string[]; mustInclude?: string[]; label: string }> = {
  a8: { hosts: ['px.a8.net'], mustInclude: ['a8mat='], label: 'A8.net' },
  moshimo: { hosts: ['af.moshimo.com'], mustInclude: ['a_id='], label: 'もしもアフィリエイト' },
  rakuten: { hosts: ['hb.afl.rakuten.co.jp'], label: '楽天アフィリエイト' },
  amazon: { hosts: ['www.amazon.co.jp', 'amazon.co.jp', 'amzn.to'], mustInclude: ['tag='], label: 'Amazonアソシエイト' },
  valuecommerce: { hosts: ['ck.jp.ap.valuecommerce.com'], mustInclude: ['sid='], label: 'バリューコマース' },
  afb: { hosts: ['t.afi-b.com'], label: 'afb' },
  accesstrade: { hosts: ['h.accesstrade.net'], label: 'アクセストレード' },
  other: { hosts: [], label: 'その他' },
};

/** 直書き検出用：アフィリエイトリンクのホスト一覧 */
export const AFFILIATE_HOSTS = Object.values(ASP_RULES).flatMap((r) => r.hosts).filter((h) => !h.includes('amazon.co.jp'));

let cache: AffiliateMaster | null = null;

export function loadAffiliates(): AffiliateMaster {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = JSON.parse(fs.readFileSync(p('config', 'affiliates.json'), 'utf8')) as AffiliateMaster;
  return cache;
}

/** IDから案件を取得。存在しない・提携停止中ならビルドを止める（壊れたリンクを本番に出さないため） */
export function getProgram(id: string): AffiliateProgram {
  const program = loadAffiliates().programs.find((x) => x.id === id);
  if (!program) throw new Error(`[affiliates] 案件ID "${id}" が config/affiliates.json に存在しません`);
  if (program.status !== 'active') {
    throw new Error(`[affiliates] 案件ID "${id}" は status="${program.status}" です。LPから外すか status を active にしてください`);
  }
  return program;
}
