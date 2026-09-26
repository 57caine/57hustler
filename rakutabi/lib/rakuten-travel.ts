/**
 * 楽天トラベルAPIクライアント（Node.js専用。ビルド時・GitHub Actionsのスクリプトからのみ使う）
 *
 * lens-navi（楽天市場商品検索API、2026-08調査）で判明した以下の知見を流用している:
 * - 2026年の楽天ウェブサービス仕様変更で、ドメインが openapi.rakuten.co.jp に変わり、
 *   applicationId に加えて accessKey が必須になった
 * - リクエストに Referer / Origin ヘッダーが必須で、その値は楽天ウェブサービス管理画面の
 *   「許可されたWebサイト」に登録済みのドメインである必要がある
 *   （未送信だと REQUEST_CONTEXT_BODY_HTTP_REFERRER_MISSING エラー）
 * - Node.js標準の fetch()（undici）は referrer オプションを指定しても Referer を送らないため、
 *   node:https で直接リクエストを組み立てる
 * - 連続リクエストはレート制限に掛かるため、呼び出し側で間隔を空ける
 *
 * 楽天トラベルAPIのエンドポイント・バージョンは、この開発環境から楽天の公式ドキュメントに
 * 直接アクセスできないため、Web検索結果をもとに設定している。実際に通るかどうかは
 * scripts/test-connection.ts（GitHub Actions上で実行）で確認する。
 */

import https from 'node:https';

const BASE = 'https://openapi.rakuten.co.jp/engine/api/Travel';

export const ENDPOINTS = {
  simpleHotelSearch: `${BASE}/SimpleHotelSearch/20260731`,
  vacantHotelSearch: `${BASE}/VacantHotelSearch/20170426`,
  hotelDetailSearch: `${BASE}/HotelDetailSearch/20260731`,
  getAreaClass: `${BASE}/GetAreaClass/20131024`,
} as const;

export interface RakutenCredentials {
  applicationId: string;
  accessKey: string;
  /** 本事業専用の楽天アフィリエイトID。設定すると返却URLがアフィリエイトリンク（hb.afl.rakuten.co.jp）になる */
  affiliateId?: string;
  /** 楽天ウェブサービスの「許可されたWebサイト」に登録済みのURL */
  referer: string;
}

export function credentialsFromEnv(): RakutenCredentials {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!applicationId) throw new Error('RAKUTEN_APP_ID is not set');
  if (!accessKey) throw new Error('RAKUTEN_ACCESS_KEY is not set');
  return {
    applicationId,
    accessKey,
    affiliateId: process.env.RAKUTABI_RAKUTEN_AFFILIATE_ID || undefined,
    // 新ドメイン取得後、楽天ウェブサービス側に登録したうえでこの値を差し替える
    referer: process.env.RAKUTEN_API_REFERER || 'https://lens-navi.jp/',
  };
}

export interface ApiResult<T = unknown> {
  ok: boolean;
  statusCode: number;
  data?: T;
  error?: string;
}

function requestOnce(url: string, headers: Record<string, string>): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body }));
    });
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

export async function callApi<T = unknown>(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  cred: RakutenCredentials,
): Promise<ApiResult<T>> {
  const query = new URLSearchParams({
    applicationId: cred.applicationId,
    accessKey: cred.accessKey,
    format: 'json',
  });
  if (cred.affiliateId) query.set('affiliateId', cred.affiliateId);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) query.set(k, String(v));
  }
  const origin = new URL(cred.referer).origin;
  try {
    const { statusCode, body } = await requestOnce(`${endpoint}?${query}`, {
      Referer: cred.referer,
      Origin: origin,
    });
    let json: Record<string, unknown> | undefined;
    try {
      json = JSON.parse(body);
    } catch {
      return { ok: false, statusCode, error: `JSONではない応答: ${body.slice(0, 300)}` };
    }
    if (statusCode !== 200 || json?.error) {
      return {
        ok: false,
        statusCode,
        error: `${json?.error ?? ''} ${json?.error_description ?? ''}`.trim() || body.slice(0, 300),
      };
    }
    return { ok: true, statusCode, data: json as T };
  } catch (e) {
    return { ok: false, statusCode: 0, error: `REQUEST ERROR: ${(e as Error).message}` };
  }
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 楽天トラベルの施設レスポンス（format=json, formatVersion=1）は
 * hotels: [{ hotel: [{ hotelBasicInfo }, { hotelRatingInfo }, { roomInfo }, ...] }]
 * という「オブジェクトの配列」の形をしているため、1つのオブジェクトに平らにまとめる。
 */
export interface RawHotel {
  hotelBasicInfo?: Record<string, unknown>;
  hotelRatingInfo?: Record<string, unknown>;
  roomInfo?: { roomBasicInfo?: Record<string, unknown>; dailyCharge?: Record<string, unknown> }[];
}

export function flattenHotels(data: unknown): RawHotel[] {
  const hotels = (data as { hotels?: unknown[] })?.hotels ?? [];
  return hotels.map((h) => {
    const parts = ((h as { hotel?: unknown[] }).hotel ?? []) as Record<string, unknown>[];
    const merged: RawHotel = {};
    const rooms: NonNullable<RawHotel['roomInfo']> = [];
    for (const part of parts) {
      if (part.hotelBasicInfo) merged.hotelBasicInfo = part.hotelBasicInfo as Record<string, unknown>;
      if (part.hotelRatingInfo) merged.hotelRatingInfo = part.hotelRatingInfo as Record<string, unknown>;
      if (part.roomInfo) {
        // 空室検索APIは roomInfo: [{ roomBasicInfo }, { dailyCharge }] の組を返す
        const ri = part.roomInfo as Record<string, unknown>[];
        const room: NonNullable<RawHotel['roomInfo']>[number] = {};
        for (const r of ri) {
          if (r.roomBasicInfo) room.roomBasicInfo = r.roomBasicInfo as Record<string, unknown>;
          if (r.dailyCharge) room.dailyCharge = r.dailyCharge as Record<string, unknown>;
        }
        rooms.push(room);
      }
    }
    if (rooms.length) merged.roomInfo = rooms;
    return merged;
  });
}
